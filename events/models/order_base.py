from decimal import Decimal
from django.db import models
from django.conf import settings

from events.utils.fee_calc import calculate_delivery_fee

class OrderBase(models.Model):
    """
    The single order model for the system. `billing_mode` distinguishes
    one-time and recurring orders.
    """
    STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )

    BILLING_MODE_CHOICES = (
        ('one_time', 'One-time'),
        ('recurring', 'Recurring'),
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
    billing_mode = models.CharField(
        max_length=20,
        choices=BILLING_MODE_CHOICES,
        default='one_time',
        help_text="How this order is billed: one-time or recurring."
    )

    # --- Plan Details ---
    FREQUENCY_CHOICES = (
        ('weekly', 'Weekly'),
        ('fortnightly', 'Fortnightly'),
        ('monthly', 'Monthly'),
        ('annually', 'Annually'),
    )

    budget = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="The budget per bouquet."
    )
    delivery_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="Delivery fee, auto-computed on save. Zero once the budget "
                  "reaches the threshold, where delivery comes out of the budget."
    )
    subtotal = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="Output of the pricing formula before discounts/tax."
    )
    discount_code = models.ForeignKey(
        'partners.DiscountCode',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        help_text="The discount code applied to this order."
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="The discount amount applied to this order."
    )
    tax_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="Tax amount (placeholder for future use)."
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="The final total amount for the plan, auto-computed on save."
    )
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        null=True, blank=True,
        help_text="How often deliveries are made."
    )

    # --- Recipient Details ---
    recipient_first_name = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's first name.")
    hash_recipient_first_name = models.CharField(max_length=64, blank=True, null=True, editable=False)
    recipient_last_name = models.CharField(max_length=100, blank=True, null=True, help_text="Recipient's last name.")
    hash_recipient_last_name = models.CharField(max_length=64, blank=True, null=True, editable=False)
    recipient_street_address = models.CharField(max_length=255, blank=True, null=True, help_text="Recipient's street address.")
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
    flower_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Optional notes about flower preferences."
    )
    recurring_preferences = models.TextField(
        blank=True,
        null=True,
        help_text="Optional instructions for recurring deliveries, such as variation or seasonal preferences."
    )
    stripe_subscription_id = models.CharField(
        max_length=255, blank=True, null=True,
        help_text="The ID from Stripe for managing a recurring order's subscription."
    )

    # --- Card message (pre-payment staging) ---
    card_message = models.TextField(
        blank=True,
        null=True,
        help_text=(
            "Card message for a one-off delivery, staged before payment and copied "
            "onto the Event when it is created. Subscriptions are delivered without "
            "a card message, so this is ignored when billing_mode is 'recurring'."
        )
    )

    def save(self, *args, **kwargs):
        if self.budget:
            self.delivery_fee = calculate_delivery_fee(self.budget)
            self.subtotal = (self.budget + self.delivery_fee).quantize(Decimal('0.01'))
        self.total_amount = (
            (self.subtotal or Decimal('0'))
            - (self.discount_amount or Decimal('0'))
            + (self.tax_amount or Decimal('0'))
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} ({self.billing_mode}) for {self.user.username}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Order"
        verbose_name_plural = "Orders"
