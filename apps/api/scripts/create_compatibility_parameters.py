#!/usr/bin/env python3
"""Create or update compatibility parameters.

Run from the API app directory:

    python scripts/create_compatibility_parameters.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parents[1]

if str(PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
from django.apps import apps

if not apps.ready:
    django.setup()

from matchmaking.models import CompatibilityParameter


PARAMETERS = [
    {
        "order": 1,
        "label": "Understanding",
        "key": "compatibility",
        "is_free": False,
        "is_active": True,
    },
    {
        "order": 2,
        "label": "Durability",
        "key": "durability",
        "is_free": False,
        "is_active": True,
    },
    {
        "order": 3,
        "label": "Chemistry",
        "key": "chemistry",
        "is_free": True,
        "is_active": True,
    },
    {
        "order": 4,
        "label": "Sizzle",
        "key": "sizzle",
        "is_free": True,
        "is_active": True,
    },
    {
        "order": 5,
        "label": "Destiny",
        "key": "destiny",
        "is_free": False,
        "is_active": True,
    },
    {
        "order": 6,
        "label": "Friendship",
        "key": "friendship",
        "is_free": False,
        "is_active": True,
    },
    {
        "order": 7,
        "label": "What Am I To You?",
        "key": "waity",
        "is_free": False,
        "is_active": True,
    },
]


def main() -> None:
    created_count = 0
    updated_count = 0

    for parameter in PARAMETERS:
        obj, created = CompatibilityParameter.objects.update_or_create(
            key=parameter["key"],
            defaults={
                "order": parameter["order"],
                "label": parameter["label"],
                "is_free": parameter["is_free"],
                "is_active": parameter["is_active"],
            },
        )

        if created:
            created_count += 1
            action = "created"
        else:
            updated_count += 1
            action = "updated"

        print(
            f"{action}: id={obj.id} order={obj.order} "
            f"label={obj.label!r} key={obj.key!r} "
            f"is_free={obj.is_free} is_active={obj.is_active}"
        )

    print(
        f"Done. Created {created_count} parameter(s), "
        f"updated {updated_count} parameter(s)."
    )


if __name__ == "__main__":
    main()
