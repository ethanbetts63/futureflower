import random
import string
from django.db import models
from django.utils.text import slugify


class DiscountCode(models.Model):
    partner = models.OneToOneField(
        'partners.Partner',
        on_delete=models.CASCADE,
        related_name='discount_code'
    )
    code = models.CharField(max_length=30, unique=True, db_index=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} (${self.discount_amount})"

    @staticmethod
    def generate_code(business_name):
        base = slugify(business_name)[:20] if business_name else 'partner'
        suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        return f"{base}-{suffix}"
