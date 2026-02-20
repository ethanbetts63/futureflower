import factory
from factory.django import DjangoModelFactory
from data_management.models import Notification
from users.tests.factories.user_factory import UserFactory
from partners.tests.factories.partner_factory import PartnerFactory
from events.tests.factories.event_factory import EventFactory

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    recipient_type = 'customer'
    recipient_user = factory.SubFactory(UserFactory)
    channel = 'email'
    subject = factory.Faker('sentence')
    body = factory.Faker('text')
    scheduled_for = factory.Faker('future_date')
    status = 'pending'
    
    related_event = factory.SubFactory(EventFactory)
