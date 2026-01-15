# data_management/tests/view_tests/test_product_views.py
import pytest
from rest_framework.test import APIClient
from payments.tests.factories.price_factory import PriceFactory
from payments.models import Price
from django.core.cache import cache
from decimal import Decimal

@pytest.mark.django_db
def test_single_event_price_success():
    """
    Tests that the view returns the correct price data when an active,
    one-time price exists.
    """
    cache.clear()
    client = APIClient()

    # Create the active one-time price
    active_price = PriceFactory(is_active=True, type='one_time')
    # Create other inactive or different type prices that should be ignored
    PriceFactory(is_active=False, type='one_time')
    PriceFactory(is_active=True, type='recurring')

    assert Price.objects.count() == 3

    response = client.get('/api/data/products/single-event-price/')

    assert response.status_code == 200
    
    # Convert response amount to Decimal for accurate comparison
    response_amount = Decimal(response.data['amount']).quantize(Decimal('0.01'))
    expected_amount = active_price.amount.quantize(Decimal('0.01'))

    assert response.data['priceId'] == active_price.id
    assert response_amount == expected_amount
    assert response.data['currency'] == active_price.currency

@pytest.mark.django_db
def test_single_event_price_not_found():
    """
    Tests that the view returns a 500 Internal Server Error when no active,
    one-time price is configured.
    """
    cache.clear()
    client = APIClient()

    # Create only prices that should be ignored
    PriceFactory(is_active=False, type='one_time')
    PriceFactory(is_active=True, type='recurring')

    assert Price.objects.count() == 2

    response = client.get('/api/data/products/single-event-price/')

    assert response.status_code == 500
    assert "No active price configured" in response.data['error']