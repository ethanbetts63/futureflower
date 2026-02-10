from decimal import Decimal


def calculate_service_fee(
    budget: Decimal,
    commission_pct: Decimal = Decimal('0.05'),
    min_fee: Decimal = Decimal('15.00'),
) -> Decimal:
    """
    Calculates the service fee for a single delivery based on the bouquet budget.
    The fee is the greater of a percentage commission or a flat minimum.
    """
    return max(budget * commission_pct, min_fee)
