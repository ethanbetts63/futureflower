import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import Event
from events.tests.factories.order_factory import OrderFactory

class EventFactory(DjangoModelFactory):
    class Meta:
        model = Event

    order = SubFactory(OrderFactory)
    delivery_date = Faker('future_date')
    message = Faker('paragraph')
    status = 'scheduled'
