import pytest
from events.serializers.event_serializer import EventSerializer
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.payment_factory import PaymentFactory

@pytest.mark.django_db
def test_event_serializer_with_payment():
    """
    Tests that the EventSerializer correctly serializes an Event instance
    with a successful payment.
    """
    event = EventFactory()
    payment = PaymentFactory(event=event, status='succeeded')
    serializer = EventSerializer(instance=event)
    data = serializer.data

    assert data['id'] == event.id
    assert data['name'] == event.name
    assert 'event_date' in data
    assert data['notes'] == event.notes
    assert data['weeks_in_advance'] == event.weeks_in_advance
    assert data['user'] == event.user.id
    assert data['is_active'] == event.is_active
    assert 'created_at' in data
    assert 'updated_at' in data
    assert data['payment_details']['amount'] == str(payment.amount)
    assert 'date' in data['payment_details']
    assert data['tier']['id'] == event.tier.id
    assert data['tier']['name'] == event.tier.name

@pytest.mark.django_db
def test_event_serializer_without_payment():
    """
    Tests that the EventSerializer correctly serializes an Event instance
    without a payment.
    """
    event = EventFactory()
    serializer = EventSerializer(instance=event)
    data = serializer.data

    assert data['id'] == event.id
    assert data['name'] == event.name
    assert data['payment_details'] is None
    assert data['tier']['id'] == event.tier.id
