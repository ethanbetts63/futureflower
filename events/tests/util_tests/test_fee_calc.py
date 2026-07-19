from decimal import Decimal

from django.test import override_settings

from events.utils.fee_calc import calculate_delivery_fee


# The configured threshold is a business setting that moves (it is currently
# $1, making delivery effectively always included). These tests pin it so they
# exercise the mechanism, not today's setting.
@override_settings(DELIVERY_INCLUDED_THRESHOLD=100, DELIVERY_FEE=20)
def test_fee_charged_below_threshold():
    assert calculate_delivery_fee(Decimal('65.00')) == Decimal('20.00')
    assert calculate_delivery_fee(Decimal('99.99')) == Decimal('20.00')


@override_settings(DELIVERY_INCLUDED_THRESHOLD=100, DELIVERY_FEE=20)
def test_no_fee_at_or_above_threshold():
    # At the threshold the budget absorbs delivery, so nothing is added.
    assert calculate_delivery_fee(Decimal('100.00')) == Decimal('0.00')
    assert calculate_delivery_fee(Decimal('400.00')) == Decimal('0.00')


def test_missing_budget_is_free():
    assert calculate_delivery_fee(None) == Decimal('0.00')
    assert calculate_delivery_fee(Decimal('0')) == Decimal('0.00')
