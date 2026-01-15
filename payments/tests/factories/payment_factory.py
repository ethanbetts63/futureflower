import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from payments.models import Payment
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.price_factory import PriceFactory
from events.tests.factories.event_factory import EventFactory

class PaymentFactory(DjangoModelFactory):
    class Meta:
        model = Payment

    user = SubFactory(UserFactory)
    price = SubFactory(PriceFactory)
    event = SubFactory(EventFactory)
    stripe_payment_intent_id = Faker('uuid4')
    amount = Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    status = 'succeeded'
