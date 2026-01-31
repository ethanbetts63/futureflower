# events/models/one_time_plan.py
from django.db import models
from .order_base import OrderBase

class SingleDeliveryPlan(OrderBase):
    """
    An order for a single flower delivery with a one-time payment.
    """
    budget = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="The budget for the single bouquet."
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="The final total amount for this one-time delivery, including fees."
    )

    def __str__(self):
        return f"One-Time Plan {self.id} for {self.user.username}"

    class Meta:
        verbose_name = "One-Time Plan"
        verbose_name_plural = "One-Time Plans"
