import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from payments.models import Price
from payments.tests.factories.tier_factory import TierFactory

class PriceFactory(DjangoModelFactory):
    class Meta:
        model = Price

    tier = SubFactory(TierFactory)
    stripe_price_id = Faker('uuid4')
    amount = Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    currency = 'usd'
    type = 'one_time'
    is_active = True
