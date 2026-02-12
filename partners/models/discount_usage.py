from django.db import models
from django.conf import settings


class DiscountUsage(models.Model):
    discount_code = models.ForeignKey(
        'partners.DiscountCode',
        on_delete=models.CASCADE,
        related_name='usages'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='discount_usages'
    )
    payment = models.OneToOneField(
        'payments.Payment',
        on_delete=models.CASCADE,
        related_name='discount_usage'
    )
    discount_applied = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.discount_code.code} used by {self.user.email}"
