import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from payments.models import Payment
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.flower_plan_factory import FlowerPlanFactory # Correct import

class PaymentFactory(DjangoModelFactory):
    class Meta:
        model = Payment

    user = SubFactory(UserFactory)
    flower_plan = SubFactory(FlowerPlanFactory) # Correct ForeignKey
    stripe_payment_intent_id = Faker('uuid4')
    amount = Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    status = 'succeeded'
