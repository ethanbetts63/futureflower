from decimal import Decimal

def calculate_service_fee(
    budget: Decimal,
    commission_pct: Decimal = Decimal('0.00'),
    min_fee: Decimal = Decimal('0.00'),
) -> Decimal:
    """
    Calculates the service fee for a single delivery based on the bouquet budget.
    Defaults to 0.00 as requested, but allows for commission and min_fee overrides.
    """
    return max(budget * commission_pct, min_fee)
