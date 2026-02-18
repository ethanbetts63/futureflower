from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model that includes fields for various contact methods
    and fields to support data anonymization upon account deletion.
    """
    password_reset_last_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp of when the last password reset email was sent."
    )

    # Legal — tracks which T&C versions this user has accepted, with timestamps.
    # Use user.terms_acceptances.all() for audit detail (includes accepted_at).
    # Use user.accepted_terms.filter(terms_type='customer').exists() for quick checks.
    accepted_terms = models.ManyToManyField(
        'data_management.TermsAndConditions',
        through='data_management.TermsAcceptance',
        blank=True,
        related_name='accepting_users',
    )

    stripe_customer_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="The user's Stripe Customer ID."
    )

    referred_by_partner = models.ForeignKey(
        'partners.Partner',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='referred_users',
        help_text="The partner who referred this user via discount code."
    )

    # --------------------------------------------------------------------------
    # Anonymization Fields
    # These fields store the hashes of PII and are only populated upon account
    # deletion. The original PII fields are then wiped.
    # --------------------------------------------------------------------------
    
    anonymized_at = models.DateTimeField(
        null=True,
        blank=True,
        editable=False,
        help_text="Timestamp of when the account was anonymized."
    )
    
    # Hashed versions of user PII for audit purposes.
    # CharField with max_length=64 for SHA-256 hashes.
    hash_first_name = models.CharField(max_length=64, blank=True, editable=False)
    hash_last_name = models.CharField(max_length=64, blank=True, editable=False)
    hash_email = models.CharField(max_length=64, blank=True, editable=False, db_index=True)

    def __str__(self):
        return self.username