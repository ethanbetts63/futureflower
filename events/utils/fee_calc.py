from decimal import Decimal

FREQUENCY_TO_DELIVERIES = {
    'weekly': 52,
    'fortnightly': 26,
    'monthly': 12,
    'quarterly': 4,
    'bi-annually': 2,
    'annually': 1,
}

def frequency_to_deliveries_per_year(frequency: str) -> int:
    """Converts a frequency string to the number of deliveries per year."""
    result = FREQUENCY_TO_DELIVERIES.get(frequency)
    if result is None:
        raise ValueError(f"Invalid frequency: {frequency}")
    return result


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
