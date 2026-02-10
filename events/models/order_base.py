from django.db import models
from django.conf import settings

class OrderBase(models.Model):
    """
    A concrete base class for all order types in the system (e.g., Upfront, Subscription).
    Contains all common fields related to a user, recipient, and preferences.
    """
    STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        help_text="The user who owns this order."
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending_payment',
        help_text="The current status of the order."
    )
    currency = models.CharField(
        max_length=3, default='USD',
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

    delivery_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Optional notes to provide more context about the order."
    )
    start_date = models.DateField(
        null=True, blank=True,
        help_text="The date the plan's deliveries begin."
    )
    preferred_delivery_time = models.CharField(
        max_length=50, blank=True, null=True,
        help_text="Preferred time window for deliveries (e.g., 'morning', 'afternoon')."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # --- Preferences ---
    preferred_colors = models.ManyToManyField(
        'events.Color',
        related_name='preferred_orders',
        blank=True
    )
    preferred_flower_types = models.ManyToManyField(
        'events.FlowerType',
        related_name='preferred_orders',
        blank=True
    )
    rejected_colors = models.ManyToManyField(
        'events.Color',
        related_name='rejected_orders',
        blank=True
    )
    rejected_flower_types = models.ManyToManyField(
        'events.FlowerType',
        related_name='rejected_orders',
        blank=True
    )

    def __str__(self):
        # This will show the specific type of order (e.g., "Upfront Plan")
        child_instance = self.get_child_instance()
        # Prevent recursion if no child exists
        if child_instance and child_instance != self:
             return f"{child_instance.__class__.__name__} {self.id} for {self.user.username}"
        return f"Order {self.id} for {self.user.username}"

    def get_child_instance(self):
        """
        Retrieves the actual child instance (e.g., UpfrontPlan) of this OrderBase.
        """
        if hasattr(self, 'upfrontplan'):
            return self.upfrontplan
        # In the future, add checks for other order types here
        # if hasattr(self, 'subscriptionplan'):
        #     return self.subscriptionplan
        return None # Fallback to None if no child is found

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Order"
        verbose_name_plural = "Orders"
