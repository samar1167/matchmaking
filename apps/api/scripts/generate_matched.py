#!/usr/bin/env python3
"""Generate stored user matches.

This file can be run directly from its own directory:

    ./generate_matched.py

or with Python:

    python3 generate_matched.py
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import date, timedelta
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parents[1]

if str(PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
from django.apps import apps

if not apps.ready:
    django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from matchmaking.models import UserMatch, UserProfile

User = get_user_model()
USER_PROFILE_FIELDS = {field.name for field in UserProfile._meta.get_fields()}
MIN_MATCH_SCORE = 10


def profile_has_field(field_name):
    return field_name in USER_PROFILE_FIELDS


def has_preference_value(value):
    return bool(value) and value != "any"


def candidate_preference_matches(candidate_profile, preference_field, expected_value):
    if not has_preference_value(expected_value):
        return False

    candidate_pref = getattr(candidate_profile.user, "match_preferences", None)
    if not candidate_pref:
        return False

    return getattr(candidate_pref, preference_field, None) == expected_value


def age_from_birth_date(date_of_birth):
    if date_of_birth is None:
        return None

    today = date.today()
    return (
        today.year
        - date_of_birth.year
        - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    )


def same_month_day_years_ago(value, years):
    try:
        return value.replace(year=value.year - years)
    except ValueError:
        return value.replace(year=value.year - years, day=28)


# -----------------------------
# Candidate Fetching
# -----------------------------
def get_candidates(user_profile, pref, limit=25):
    qs = UserProfile.objects.exclude(id=user_profile.id).select_related(
        "user",
        "user__match_preferences"
    )
    qs = qs.filter(public_match=True)

    # -------- Gender filter --------
    if pref.preferred_gender and pref.preferred_gender != "any":
        qs = qs.filter(gender=pref.preferred_gender)

    # -------- Age filter --------
    if pref.preferred_age_min or pref.preferred_age_max:
        today = timezone.localdate()
        qs = qs.filter(date_of_birth__isnull=False)

        if pref.preferred_age_min:
            latest_birth_date = same_month_day_years_ago(today, pref.preferred_age_min)
            qs = qs.filter(date_of_birth__lte=latest_birth_date)

        if pref.preferred_age_max:
            earliest_birth_date = same_month_day_years_ago(today, pref.preferred_age_max + 1)
            qs = qs.filter(date_of_birth__gt=earliest_birth_date)

    # -------- Activity preference (User.last_login) --------
    cutoff = timezone.now() - timedelta(days=7)
    active_qs = qs.filter(user__last_login__gte=cutoff)
    if active_qs.exists():
        qs = active_qs

    # ---- deterministic rotation ----
    total = qs.count()
    if total == 0:
        return qs.none()

    day = timezone.now().timetuple().tm_yday  # 1–365

    offset = (user_profile.id + day) % total

    # ---- slice safely ----
    if offset + limit <= total:
        return qs.order_by("id")[offset: offset + limit]
    else:
        # wrap around
        first_part = list(qs.order_by("id")[offset:])
        second_part = list(qs.order_by("id")[:limit - len(first_part)])
        return first_part + second_part


# -----------------------------
# Scoring
# -----------------------------
def score(user_profile, pref, candidate_profile):
    s = 0

    candidate_pref = getattr(candidate_profile.user, "match_preferences", None)

    # -------- Age closeness --------
    if pref.preferred_age_min and pref.preferred_age_max:
        mid = (pref.preferred_age_min + pref.preferred_age_max) / 2
        candidate_age = age_from_birth_date(candidate_profile.date_of_birth)
        if candidate_age is not None:
            age_diff = abs(candidate_age - mid)
            s += max(0, 20 - age_diff)

    # -------- Relationship intent --------
    if candidate_preference_matches(
        candidate_profile,
        "preferred_relationship_intent",
        pref.preferred_relationship_intent,
    ):
        s += 30

    # -------- Marital status --------
    if candidate_preference_matches(
        candidate_profile,
        "preferred_marital_status",
        pref.preferred_marital_status,
    ):
        s += 20

    # -------- Simple trait overlap (boolean for now) --------
    if candidate_pref:
        traits = [
            "modern_methods",
            "karmic_glue",
            "ancient_methods",
            "deal_maker",
            "sizzle",
        ]

        overlap = sum(
            getattr(pref, t) == getattr(candidate_pref, t)
            for t in traits
        )

        s += overlap * 5

    return s


def mutual_score(user_profile, user_pref, candidate_profile):
    candidate_pref = getattr(candidate_profile.user, "match_preferences", None)

    total_score = score(user_profile, user_pref, candidate_profile)

    if candidate_pref:
        total_score += score(candidate_profile, candidate_pref, user_profile)

    return total_score


# -----------------------------
# Generate matches for one user
# -----------------------------
def generate_matches_for_user(user_profile, top_n=5):
    user = user_profile.user
    pref = getattr(user, "match_preferences", None)

    if not pref:
        return

    candidates = get_candidates(user_profile, pref, limit=max(top_n * 4, 20))

    scored = []
    for c in candidates:
        s = mutual_score(user_profile, pref, c)
        if s >= MIN_MATCH_SCORE:
            scored.append((c, s))

    scored.sort(key=lambda x: x[1], reverse=True)
    top_matches = scored[:top_n]

    with transaction.atomic():
        UserMatch.objects.filter(user=user_profile).delete()

        bulk = []
        for rank, (candidate, s) in enumerate(top_matches, start=1):
            bulk.append(
                UserMatch(
                    user=user_profile,
                    matched_user=candidate,
                    score=s,
                    rank=rank,
                )
            )

        if bulk:
            UserMatch.objects.bulk_create(bulk, ignore_conflicts=True)


# -----------------------------
# Batch runner
# -----------------------------
def run(batch_size=200, top_n=5):
    print("Starting match generation...")

    #Clear existing matches
    UserMatch.objects.all().delete()
    print(f"Cleared existing matches")

    qs = UserProfile.objects.select_related(
        "user",
        "user__match_preferences"
    ).only(
        "id",
        "date_of_birth",
        "gender",
        "user__last_login",
    )

    total = qs.count()
    print(f"Total users: {total}")

    processed = 0

    for i in range(0, total, batch_size):
        batch = qs[i : i + batch_size]

        for user_profile in batch:
            try:
                generate_matches_for_user(user_profile, top_n=top_n)
                processed += 1
            except Exception as e:
                print(f"Error for user {user_profile.id}: {e}")

        print(f"Processed {processed}/{total}")

    print("Match generation complete.")


def main():
    parser = argparse.ArgumentParser(description="Generate stored UserMatch rows for public user profiles.")
    parser.add_argument("--batch-size", type=int, default=200, help="Number of profiles to process per batch.")
    parser.add_argument("--top-n", type=int, default=5, help="Maximum matches to store per user.")
    args = parser.parse_args()

    run(batch_size=args.batch_size, top_n=args.top_n)


if __name__ == "__main__":
    main()
