from django.db.models.signals import pre_delete
from django.dispatch import receiver
from partners.models import Partner


@receiver(pre_delete, sender=Partner)
def deactivate_discount_code_on_partner_delete(sender, instance, **kwargs):
    """When a partner is deleted, deactivate their discount code instead of losing it."""
    from partners.models import DiscountCode
    DiscountCode.objects.filter(partner=instance).update(is_active=False)
