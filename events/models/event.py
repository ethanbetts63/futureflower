from django.db import models
from django.conf import settings

class Event(models.Model):
    """
    Represents a single flower delivery event within a FlowerPlan.
    """
    flower_plan = models.ForeignKey(
        'events.FlowerPlan',
        on_delete=models.CASCADE,
        related_name="events",
        blank=True,
        null=True,
        help_text="The flower plan this event belongs to."
    )
    delivery_date = models.DateField(
        help_text="The date the flower delivery will occur."
    )
    message = models.TextField(
        blank=True,
        null=True,
        help_text="Custom message for this specific delivery."
    )
    bouquet_preference = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="User's preference for the bouquet (e.g., 'Sunflowers')."
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
        return f"Delivery on {self.delivery_date} for Plan {self.flower_plan.id}"

    class Meta:
        ordering = ['delivery_date']

