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
    recipient_details = models.JSONField(
        null=True,
        blank=True,
        help_text="Recipient's details like name, address, etc."
    )
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
