# payments/tests/serializer_tests/test_tier_serializer.py
import pytest
from payments.serializers.tier_serializer import TierSerializer
from payments.tests.factories.tier_factory import TierFactory
from payments.tests.factories.price_factory import PriceFactory

@pytest.mark.django_db
def test_tier_serializer():
    """
    Tests that the TierSerializer correctly serializes a Tier object,
    including its nested prices.
    """
    # 1. Create a Tier
    tier = TierFactory()
    
    # 2. Create prices associated with the tier
    price1 = PriceFactory(tier=tier)
    price2 = PriceFactory(tier=tier)

    # 3. Serialize the tier
    serializer = TierSerializer(instance=tier)

    # 4. Define the expected data structure
    expected_data = {
        'id': tier.id,
        'name': tier.name,
        'description': tier.description,
        'prices': [
            {
                'id': price1.id,
                'amount': f'{price1.amount:.2f}',
                'currency': price1.currency,
                'type': price1.type,
            },
            {
                'id': price2.id,
                'amount': f'{price2.amount:.2f}',
                'currency': price2.currency,
                'type': price2.type,
            }
        ]
    }
    
    # The order of prices is not guaranteed, so we compare them as sets
    # Convert list of dicts to a frozenset of tuples for comparison
    actual_prices = set(map(lambda d: tuple(d.items()), serializer.data['prices']))
    expected_prices = set(map(lambda d: tuple(d.items()), expected_data['prices']))

    assert actual_prices == expected_prices
    
    # Check the other fields
    assert serializer.data['id'] == expected_data['id']
    assert serializer.data['name'] == expected_data['name']
    assert serializer.data['description'] == expected_data['description']
