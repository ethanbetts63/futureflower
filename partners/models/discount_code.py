from django.db import models
from django.utils.text import slugify


class DiscountCode(models.Model):
    partner = models.OneToOneField(
        'partners.Partner',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='discount_code'
    )
    code = models.CharField(max_length=30, db_index=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} (${self.discount_amount})"

    @staticmethod
    def generate_code(business_name, discount_amount=5):
        base = slugify(business_name)[:20] if business_name else 'partner'
        code = f"{base}-{int(discount_amount)}"
        if not DiscountCode.objects.filter(code=code, is_active=True).exists():
            return code
        counter = 2
        while DiscountCode.objects.filter(code=f"{code}-{counter}", is_active=True).exists():
            counter += 1
        return f"{code}-{counter}"
