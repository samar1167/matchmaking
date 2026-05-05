from decimal import Decimal
from importlib import import_module

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import transaction as db_transaction
from django.utils import timezone

from .models import FeatureFlag, PaymentRecord, UserPlan


def get_stripe_client():
    secret_key = getattr(settings, 'STRIPE_SECRET_KEY', '')
    if not secret_key:
        raise ImproperlyConfigured("Stripe is not configured. Set STRIPE_SECRET_KEY.")

    try:
        stripe = import_module('stripe')
    except ModuleNotFoundError as exc:
        raise ImproperlyConfigured("The Stripe SDK is not installed.") from exc

    stripe.api_key = secret_key
    return stripe


def get_checkout_urls():
    frontend_base_url = settings.FRONTEND_BASE_URL.rstrip('/')
    success_url = f"{frontend_base_url}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{frontend_base_url}/dashboard?payment=cancelled"
    return success_url, cancel_url


def mark_payment_record_failed(session_id):
    if not session_id:
        return None

    payment = PaymentRecord.objects.filter(payment_reference=session_id).first()
    if not payment or payment.status == 'completed':
        return payment

    payment.status = 'failed'
    payment.save(update_fields=['status'])
    return payment


def finalize_checkout_session(session):
    session_id = session.get('id')
    if not session_id:
        raise ValueError("Stripe session is missing an id.")

    if session.get('payment_status') != 'paid':
        raise ValueError("Stripe session is not paid.")

    metadata = session.get('metadata') or {}
    amount_total = session.get('amount_total') or 0

    with db_transaction.atomic():
        payment = PaymentRecord.objects.select_for_update().filter(
            payment_reference=session_id,
        ).select_related('user').first()

        if payment is None:
            user_id = metadata.get('user_id')
            if not user_id:
                raise ValueError("Stripe session metadata is missing the user id.")

            credits_purchased = int(
                metadata.get('credits_purchased') or FeatureFlag.get().credits_per_purchase
            )
            payment = PaymentRecord.objects.create(
                user_id=user_id,
                amount_usd=Decimal(amount_total) / Decimal('100'),
                credits_purchased=credits_purchased,
                status='pending',
                payment_reference=session_id,
            )

        if payment.status == 'completed':
            return payment, False

        plan, _ = UserPlan.objects.select_for_update().get_or_create(user=payment.user)
        plan.add_paid_credits(payment.credits_purchased)

        payment.status = 'completed'
        payment.completed_at = timezone.now()
        payment.amount_usd = Decimal(amount_total) / Decimal('100')
        payment.save(update_fields=['status', 'completed_at', 'amount_usd'])

    return payment, True
