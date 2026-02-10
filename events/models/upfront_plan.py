from django.db import models
from .order_base import OrderBase

class UpfrontPlan(OrderBase):
    """
    An order where the user pays for a multi-year plan upfront.
    """
    # --- Plan Details ---
    years = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="The total number of years for the plan."
    )

    # --- Pricing Details ---
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="The final total amount for the plan."
    )

    def __str__(self):
        return f"Upfront Plan {self.id} for {self.user.username}"

    class Meta:
        verbose_name = "Upfront Plan"
        verbose_name_plural = "Upfront Plans"
