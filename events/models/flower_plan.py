from django.db import models
from django.conf import settings

class FlowerPlan(models.Model):
    """
    Represents a user's subscription or plan for receiving flowers.
    This model groups together multiple delivery events.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="flower_plans",
        help_text="The user who owns this plan."
    )
    is_active = models.BooleanField(
        default=False,
        help_text="Whether the plan is active. Activated upon successful payment."
    )
    
    # --- Plan Details ---
    budget = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="The budget per bouquet."
    )
    deliveries_per_year = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="How many deliveries are scheduled per year."
    )
    years = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="The total number of years for the plan."
    )

    # --- Pricing Details ---
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="The final total amount for the plan."
    )
    currency = models.CharField(
        max_length=3, null=True, blank=True,
        help_text="The three-letter ISO currency code."
    )

    # --- Recipient Details ---
    recipient_first_name = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's first name.")
    hash_recipient_first_name = models.CharField(max_length=64, blank=True, null=True, editable=False)
    recipient_last_name = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's last name.")
    hash_recipient_last_name = models.CharField(max_length=64, blank=True, null=True, editable=False)
    recipient_street_address = models.CharField(max_length=255, blank=True, null=True, help_text="Recipient's street address.")
    hash_recipient_street_address = models.CharField(max_length=64, blank=True, null=True, editable=False)
    recipient_suburb = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's suburb or neighborhood.")
    recipient_city = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's city.")
    recipient_state = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's state, province, or region.")
    recipient_postcode = models.CharField(max_length=20, blank=True, null=True, help_text="Recipient's postal code.")
    recipient_country = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's country.")

    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Optional notes to provide more context about the plan."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # --- Preferences ---
    preferred_colors = models.ManyToManyField(
        'events.Color', 
        related_name='preferred_plans', 
        blank=True
    )
    preferred_flower_types = models.ManyToManyField(
        'events.FlowerType', 
        related_name='preferred_plans', 
        blank=True
    )
    
    rejected_colors = models.ManyToManyField(
        'events.Color', 
        related_name='rejected_plans', 
        blank=True
    )
    rejected_flower_types = models.ManyToManyField(
        'events.FlowerType', 
        related_name='rejected_plans', 
        blank=True
    )


    def __str__(self):
        return f"Flower Plan {self.id} for {self.user.username}"

    class Meta:
        ordering = ['-created_at']
