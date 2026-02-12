from django.db import models


class PayoutLineItem(models.Model):
    payout = models.ForeignKey(
        'partners.Payout',
        on_delete=models.CASCADE,
        related_name='line_items'
    )
    commission = models.OneToOneField(
        'partners.Commission',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='payout_line_item'
    )
    delivery_request = models.OneToOneField(
        'partners.DeliveryRequest',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='payout_line_item'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"LineItem {self.id} - ${self.amount}"
