from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model that includes fields for various contact methods.
    """
    password_reset_last_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp of when the last password reset email was sent."
    )
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

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        editable=False,
        help_text="Timestamp of when the account was deleted."
    )

    def __str__(self):
        return self.username