import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import Event
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.tier_factory import TierFactory

class EventFactory(DjangoModelFactory):
    class Meta:
        model = Event

    name = Faker('sentence', nb_words=4)
    event_date = Faker('future_date')
    weeks_in_advance = Faker('random_int', min=1, max=12)
    notes = Faker('paragraph')
    user = SubFactory(UserFactory)
    tier = SubFactory(TierFactory)
    is_active = Faker('boolean')
