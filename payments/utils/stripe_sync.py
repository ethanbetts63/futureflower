def get_stripe_recurring_options(frequency: str) -> dict:
    """Maps plan frequency to Stripe's recurring interval options."""
    mapping = {
        'weekly': {'interval': 'week', 'interval_count': 1},
        'fortnightly': {'interval': 'week', 'interval_count': 2},
        'monthly': {'interval': 'month', 'interval_count': 1},
        'quarterly': {'interval': 'month', 'interval_count': 3},
        'bi-annually': {'interval': 'month', 'interval_count': 6},
        'annually': {'interval': 'year', 'interval_count': 1},
    }
    return mapping.get(frequency)
