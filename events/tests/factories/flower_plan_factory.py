import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import FlowerPlan
from users.tests.factories.user_factory import UserFactory

class FlowerPlanFactory(DjangoModelFactory):
    class Meta:
        model = FlowerPlan

    user = SubFactory(UserFactory)
    is_active = False
    budget = Faker('pydecimal', left_digits=2, right_digits=2, positive=True, min_value=50, max_value=99)
    deliveries_per_year = Faker('random_int', min=1, max=12)
    years = Faker('random_int', min=1, max=10)
    total_amount = Faker('pydecimal', left_digits=3, right_digits=2, positive=True, min_value=100, max_value=999) # Changed left_digits to 3 and max_value to 999
    currency = 'usd'
    recipient_first_name = Faker('first_name')
    recipient_last_name = Faker('last_name')
    recipient_street_address = Faker('address')
    recipient_suburb = Faker('city')
    recipient_city = Faker('city')
    recipient_state = Faker('state_abbr')
    recipient_postcode = Faker('postcode')
    recipient_country = Faker('country_code')
    notes = Faker('paragraph')
