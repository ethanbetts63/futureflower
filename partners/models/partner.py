from django.db import models
from django.conf import settings


class Partner(models.Model):
    PARTNER_TYPE_CHOICES = (
        ('non_delivery', 'Non-Delivery'),
        ('delivery', 'Delivery'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('denied', 'Denied'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='partner_profile'
    )
    partner_type = models.CharField(
        max_length=20,
        choices=PARTNER_TYPE_CHOICES,
        default='non_delivery'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    business_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True)

    # Phase 2: Delivery partner fields
    street_address = models.CharField(max_length=255, blank=True)
    suburb = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Service area (pin + radius)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    service_radius_km = models.PositiveIntegerField(default=10)

    # Phase 3: Stripe Connect
    stripe_connect_account_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_connect_onboarding_complete = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name or self.user.email} ({self.partner_type})"
