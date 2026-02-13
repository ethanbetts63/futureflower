from datetime import date, timedelta
from .fee_calc import frequency_to_deliveries_per_year


def calculate_projected_delivery_dates(start_date, frequency, years):
    """
    Calculate the projected delivery dates for an upfront plan.
    Returns a list of dicts: [{"index": 0, "date": date(...)}, ...]
    """
    deliveries_per_year = frequency_to_deliveries_per_year(frequency)
    start = start_date or date.today()
    interval_days = 365 / deliveries_per_year
    results = []

    for year in range(years):
        for i in range(deliveries_per_year):
            index = year * deliveries_per_year + i
            days_offset = (year * 365) + (i * interval_days)
            delivery_date = start + timedelta(days=round(days_offset))
            results.append({"index": index, "date": delivery_date})

    return results
