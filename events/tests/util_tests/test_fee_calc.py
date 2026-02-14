import pytest
from decimal import Decimal
from events.utils.fee_calc import frequency_to_deliveries_per_year, calculate_service_fee

def test_frequency_to_deliveries_per_year():
    assert frequency_to_deliveries_per_year('weekly') == 52
    assert frequency_to_deliveries_per_year('annually') == 1
    with pytest.raises(ValueError):
        frequency_to_deliveries_per_year('invalid')

def test_calculate_service_fee():
    # 5% of 100 is 5.00, which is less than min_fee (15.00)
    assert calculate_service_fee(Decimal('100.00')) == Decimal('15.00')
    
    # 5% of 400 is 20.00, which is greater than min_fee (15.00)
    assert calculate_service_fee(Decimal('400.00')) == Decimal('20.00')

    # Custom parameters
    assert calculate_service_fee(Decimal('100.00'), commission_pct=Decimal('0.20')) == Decimal('20.00')
    assert calculate_service_fee(Decimal('10.00'), min_fee=Decimal('5.00')) == Decimal('5.00')
