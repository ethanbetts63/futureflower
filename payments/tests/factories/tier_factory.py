import factory
from factory.django import DjangoModelFactory
from factory import Faker
from payments.models import Tier

class TierFactory(DjangoModelFactory):
    class Meta:
        model = Tier

    name = factory.Sequence(lambda n: f'Tier {n}')
    description = Faker('paragraph')
    stripe_product_id = Faker('uuid4')
    is_active = Faker('boolean')
