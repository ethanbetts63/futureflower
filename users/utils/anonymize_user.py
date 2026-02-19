import logging
import stripe
from django.conf import settings
from django.utils import timezone
from users.models import User
from users.utils.hash_value import hash_value
from events.models import UpfrontPlan, SubscriptionPlan
from events.models.event import Event
from data_management.models.notification import Notification

logger = logging.getLogger(__name__)


def anonymize_user(user: User):
    """
    Orchestrates the full user anonymization process.

    This function implements the steps defined in the user deletion workflow:
    1. Cancels Stripe subscriptions before wiping data.
    2. Deletes all pending plans and anonymizes active ones.
    3. Hashes all personally identifiable information (PII) into `hash_` fields.
    4. Wipes the original PII fields.
    5. Replaces the unique email field with a placeholder.
    6. Deactivates the user account to prevent future logins.
    """
    # --- Retrieve Hashing Salt ---
    salt = getattr(settings, 'HASHING_SALT', None)
    if not salt:
        raise RuntimeError("HASHING_SALT not configured in settings. Cannot anonymize user.")

    stripe.api_key = settings.STRIPE_SECRET_KEY

    # --- Step 1: Handle UpfrontPlans and Events ---
    # Delete all non-active upfront plans
    UpfrontPlan.objects.filter(user=user, status='pending_payment').delete()

    # Anonymize active upfront plans
    active_upfront_plans = UpfrontPlan.objects.filter(user=user, status='active')
    for plan in active_upfront_plans:
        # Delete non-delivered events for this plan
        plan.events.exclude(status='delivered').delete()

        # Hash and wipe recipient PII on the upfront plan
        pii_recipient_fields_to_hash = {
            'recipient_first_name': 'hash_recipient_first_name',
            'recipient_last_name': 'hash_recipient_last_name',
        }
        for field_name, hash_field_name in pii_recipient_fields_to_hash.items():
            original_value = getattr(plan, field_name, None)
            if original_value:
                hashed_value = hash_value(original_value, salt)
                setattr(plan, hash_field_name, hashed_value)
                setattr(plan, field_name, None)
        plan.save()

    # --- Step 2: Handle SubscriptionPlans ---
    # Cancel Stripe subscriptions before wiping data (while we still have the customer ID)
    active_subscription_plans = SubscriptionPlan.objects.filter(user=user, status='active')
    for plan in active_subscription_plans:
        if plan.stripe_subscription_id:
            try:
                stripe.Subscription.cancel(plan.stripe_subscription_id)
            except stripe.error.StripeError:
                logger.warning(
                    "Could not cancel Stripe sub %s during anonymization",
                    plan.stripe_subscription_id
                )

    # Delete pending subscription plans
    SubscriptionPlan.objects.filter(user=user, status='pending_payment').delete()

    # Anonymize active subscription plans
    for plan in active_subscription_plans:
        # Cancel pending notifications for this plan's events
        event_ids = plan.events.values_list('id', flat=True)
        Notification.objects.filter(
            related_event_id__in=event_ids,
            status='pending'
        ).update(status='cancelled')

        # Delete non-delivered events
        plan.events.exclude(status='delivered').delete()

        # Hash and wipe recipient PII
        pii_recipient_fields_to_hash = {
            'recipient_first_name': 'hash_recipient_first_name',
            'recipient_last_name': 'hash_recipient_last_name',
        }
        for field_name, hash_field_name in pii_recipient_fields_to_hash.items():
            original_value = getattr(plan, field_name, None)
            if original_value:
                hashed_value = hash_value(original_value, salt)
                setattr(plan, hash_field_name, hashed_value)
                setattr(plan, field_name, None)
        plan.save()

    # --- Step 3 & 4: Hash and Wipe User PII ---
    user_pii_fields_to_hash = {
        'first_name': 'hash_first_name',
        'last_name': 'hash_last_name',
    }

    # Hash email separately as it's a special case
    if user.email:
        user.hash_email = hash_value(user.email, salt)

    for field_name, hash_field_name in user_pii_fields_to_hash.items():
        original_value = getattr(user, field_name, None)
        if original_value:
            hashed_value = hash_value(original_value, salt)
            setattr(user, hash_field_name, hashed_value)
            setattr(user, field_name, "")

    # --- Step 5: Overwrite Unique Email and Username Fields ---
    user.email = f"deleted_{user.pk}@deleted.com"
    user.username = f"deleted_user_{user.pk}"

    # --- Step 6: Deactivate Account ---
    user.is_active = False
    user.anonymized_at = timezone.now()
    user.save()
