import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import Event
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory

class EventFactory(DjangoModelFactory):
    class Meta:
        model = Event

    order = SubFactory(UpfrontPlanFactory)
    delivery_date = Faker('future_date')
    message = Faker('paragraph')
    status = 'scheduled'
