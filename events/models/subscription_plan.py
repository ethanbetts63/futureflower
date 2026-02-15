from django.db import models
from .order_base import OrderBase

class SubscriptionPlan(OrderBase):
    """
    An order where the user pays on a recurring basis.
    """
    stripe_subscription_id = models.CharField(
        max_length=255, blank=True, null=True,
        help_text="The ID from Stripe for managing the subscription."
    )
    subscription_message = models.TextField(
        blank=True, null=True,
        help_text="A single message to be included with all deliveries."
    )

    def __str__(self):
        return f"Subscription Plan {self.id} for {self.user.username}"

    class Meta:
        verbose_name = "Subscription Plan"
        verbose_name_plural = "Subscription Plans"
