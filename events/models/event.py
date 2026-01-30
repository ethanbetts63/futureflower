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
            ('in_progress', 'In Progress'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled'),
        ),
        default='scheduled',
        help_text="The status of the delivery."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery on {self.delivery_date} for Order {self.order.id}"

    class Meta:
        ordering = ['delivery_date']

