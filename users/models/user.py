from django.contrib.auth.models import AbstractUser
from django.db import models
from data_management.models import TermsAndConditions

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

    # Legal
    agreed_to_terms = models.ForeignKey(
        TermsAndConditions,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
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