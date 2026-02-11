import logging
from django.conf import settings
from django.utils import timezone
from users.models import User
from users.utils.hash_value import hash_value
from events.models import UpfrontPlan
from events.models.event import Event

logger = logging.getLogger(__name__)


def anonymize_user(user: User):
    """
    Orchestrates the full user anonymization process.

    This function implements the steps defined in the user deletion workflow:
    1. Deletes all pending UpfrontPlans and anonymizes active ones.
    2. Hashes all personally identifiable information (PII) into `hash_` fields.
    3. Wipes the original PII fields.
    4. Replaces the unique email field with a placeholder.
    5. Deactivates the user account to prevent future logins.
    """
    # --- Retrieve Hashing Salt ---
    salt = getattr(settings, 'HASHING_SALT', None)
    if not salt:
        raise RuntimeError("HASHING_SALT not configured in settings. Cannot anonymize user.")

    # --- Step 1: Handle UpfrontPlans and Events ---
    # Delete all non-active flower plans
    UpfrontPlan.objects.filter(user=user, status='pending_payment').delete()

    # Anonymize active flower plans
    active_plans = UpfrontPlan.objects.filter(user=user, status='active')
    for plan in active_plans:
        # Delete non-completed events for this plan
        plan.events.exclude(status='delivered').delete()

        # Hash and wipe recipient PII on the upfront plan
        pii_recipient_fields_to_hash = {
            'recipient_first_name': 'hash_recipient_first_name',
            'recipient_last_name': 'hash_recipient_last_name',
            'recipient_street_address': 'hash_recipient_street_address',
        }
        for field_name, hash_field_name in pii_recipient_fields_to_hash.items():
            original_value = getattr(plan, field_name, None)
            if original_value:
                hashed_value = hash_value(original_value, salt)
                setattr(plan, hash_field_name, hashed_value)
                setattr(plan, field_name, None) # Set to None for Nullable fields
        plan.save()

    # --- Step 2 & 3: Hash and Wipe User PII ---
    # A mapping of original PII fields on the User model to their `hash_` counterparts.
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
            # Hash the value and store it
            hashed_value = hash_value(original_value, salt)
            setattr(user, hash_field_name, hashed_value)
            # Wipe the original value
            setattr(user, field_name, "") # Set to empty string for CharFields
    
    # --- Step 4: Overwrite Unique Email and Username Fields ---
    user.email = f"deleted_{user.pk}@deleted.com"
    user.username = f"deleted_user_{user.pk}" # Also anonymize the username to be safe

    # --- Step 5: Deactivate Account ---
    user.is_active = False
    user.anonymized_at = timezone.now()
    user.save()
