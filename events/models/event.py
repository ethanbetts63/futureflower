from django.db import models

class Event(models.Model):
    """
    Represents a single flower delivery event within a FlowerPlan.
    """
    order = models.ForeignKey(
        'events.OrderBase',
        on_delete=models.CASCADE,
        related_name="events",
        help_text="The order this event belongs to."
    )
    delivery_date = models.DateField(
        help_text="The date the flower delivery will occur."
    )
    message = models.TextField(
        blank=True,
        null=True,
        help_text="Custom message for this specific delivery."
    )
    status = models.CharField(
        max_length=20,
        choices=(
            ('scheduled', 'Scheduled'),
            ('ordered', 'Ordered'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled'),
        ),
        default='scheduled',
        help_text="The status of the delivery."
    )
    ordered_at = models.DateTimeField(null=True, blank=True)
    ordering_evidence_text = models.TextField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    delivery_evidence_text = models.TextField(null=True, blank=True)
    commission_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Snapshotted commission amount for this delivery, set at creation."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery on {self.delivery_date} for Order {self.order.id}"

    class Meta:
        ordering = ['delivery_date']

