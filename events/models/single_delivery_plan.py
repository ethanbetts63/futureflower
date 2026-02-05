# events/models/one_time_plan.py
from django.db import models
from .order_base import OrderBase

class SingleDeliveryPlan(OrderBase):
    """
    An order for a single flower delivery with a single-delivery payment.
    """
    budget = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="The budget for the single bouquet."
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="The final total amount for this single-delivery delivery, including fees."
    )

    def __str__(self):
        return f"Single-Delivery Plan {self.id} for {self.user.username}"

    class Meta:
        verbose_name = "Single-Delivery Plan"
        verbose_name_plural = "Single-Delivery Plans"
