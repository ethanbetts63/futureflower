from decimal import Decimal

from django.conf import settings


def calculate_delivery_fee(budget: Decimal) -> Decimal:
    """
    Returns the delivery fee for a bouquet budget.

    At or above DELIVERY_INCLUDED_THRESHOLD the budget absorbs the delivery
    cost, so nothing is added. Below it the fee is charged on top, which leaves
    the budget intact for flowers.
    """
    if not budget:
        return Decimal('0.00')
    if budget >= Decimal(settings.DELIVERY_INCLUDED_THRESHOLD):
        return Decimal('0.00')
    return Decimal(settings.DELIVERY_FEE).quantize(Decimal('0.01'))
