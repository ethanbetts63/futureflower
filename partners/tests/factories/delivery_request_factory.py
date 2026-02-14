import factory
from factory.django import DjangoModelFactory
from partners.models import DeliveryRequest
from .partner_factory import PartnerFactory
from events.tests.factories.event_factory import EventFactory
from django.utils import timezone
from datetime import timedelta

class DeliveryRequestFactory(DjangoModelFactory):
    class Meta:
        model = DeliveryRequest

    event = factory.SubFactory(EventFactory)
    partner = factory.SubFactory(PartnerFactory)
    status = 'pending'
    expires_at = factory.LazyFunction(lambda: timezone.now() + timedelta(hours=24))
