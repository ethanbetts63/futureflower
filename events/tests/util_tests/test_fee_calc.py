import pytest
from decimal import Decimal
from events.utils.fee_calc import calculate_service_fee

def test_calculate_service_fee():
    # Defaults should be 0.00
    assert calculate_service_fee(Decimal('100.00')) == Decimal('0.00')
    assert calculate_service_fee(Decimal('400.00')) == Decimal('0.00')

    # Custom parameters should still work (useful for future tax/fees)
    assert calculate_service_fee(Decimal('100.00'), commission_pct=Decimal('0.20')) == Decimal('20.00')
    assert calculate_service_fee(Decimal('10.00'), min_fee=Decimal('5.00')) == Decimal('5.00')
