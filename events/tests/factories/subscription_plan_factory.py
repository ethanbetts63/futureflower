import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import SubscriptionPlan
from users.tests.factories.user_factory import UserFactory

class SubscriptionPlanFactory(DjangoModelFactory):
    class Meta:
        model = SubscriptionPlan

    user = SubFactory(UserFactory)
    status = 'pending_payment'
    budget = Faker('pydecimal', left_digits=2, right_digits=2, positive=True, min_value=50, max_value=99)
    frequency = Faker('random_element', elements=['weekly', 'fortnightly', 'monthly', 'quarterly', 'bi-annually', 'annually'])
    
    total_amount = Faker('pydecimal', left_digits=3, right_digits=2, positive=True, min_value=60, max_value=120)
    stripe_subscription_id = factory.Sequence(lambda n: f"sub_{n}")
    start_date = Faker('future_date')
    
    recipient_first_name = Faker('first_name')
    recipient_last_name = Faker('last_name')
    recipient_street_address = Faker('address')
    recipient_suburb = Faker('city')
    recipient_city = Faker('city')
    recipient_state = Faker('state_abbr')
    recipient_postcode = Faker('postcode')
    recipient_country = Faker('country_code')
