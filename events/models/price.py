from django.db import models

class Price(models.Model):
    """
    Represents the calculated price for a FlowerPlan.
    """
    flower_plan = models.OneToOneField(
        'events.FlowerPlan',
        on_delete=models.CASCADE,
        related_name='price',
        help_text="The flower plan this price is associated with."
    )
    # Storing the components of the price calculation for record-keeping
    dates = models.JSONField(
        help_text="The selected dates for delivery."
    )
    times_per_year = models.PositiveIntegerField(
        help_text="Number of deliveries per year."
    )
    number_of_years = models.PositiveIntegerField(
        help_text="Total number of years for the plan."
    )
    budget_per_bouquet = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The budget for each individual bouquet."
    )
    # Calculated price details
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The subtotal before taxes."
    )
    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The calculated tax."
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The final total amount for the plan."
    )
    currency = models.CharField(
        max_length=3,
        default='usd',
        help_text="The three-letter ISO currency code."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Price for Flower Plan {self.flower_plan.id} - ${self.total_amount}"

    class Meta:
        ordering = ['-created_at']
