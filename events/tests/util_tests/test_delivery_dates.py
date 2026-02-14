import pytest
from datetime import date, timedelta
from events.utils.delivery_dates import calculate_projected_delivery_dates

def test_calculate_projected_delivery_dates_annual():
    start = date(2025, 1, 1)
    results = calculate_projected_delivery_dates(start, 'annually', 3)
    
    assert len(results) == 3
    assert results[0]['date'] == start
    assert results[1]['date'] == start + timedelta(days=365)
    assert results[2]['date'] == start + timedelta(days=730)

def test_calculate_projected_delivery_dates_monthly():
    start = date(2025, 1, 1)
    # 12 deliveries per year * 1 year = 12 deliveries
    results = calculate_projected_delivery_dates(start, 'monthly', 1)
    
    assert len(results) == 12
    # Check intervals are roughly a month (30.41 days rounded)
    assert (results[1]['date'] - results[0]['date']).days in [30, 31]
