import pytest
from events.serializers.event_serializer import EventSerializer
from events.tests.factories.event_factory import EventFactory


@pytest.mark.django_db
class TestEventSerializer:

    def test_serializes_basic_fields(self):
        event = EventFactory(status='scheduled', message='Happy Birthday')
        data = EventSerializer(event).data
        assert data['id'] == event.pk
        assert data['status'] == 'scheduled'
        assert data['message'] == 'Happy Birthday'

    def test_includes_delivery_date(self):
        event = EventFactory()
        data = EventSerializer(event).data
        assert 'delivery_date' in data
        assert str(event.delivery_date) == str(data['delivery_date'])

    def test_includes_order_id(self):
        event = EventFactory()
        data = EventSerializer(event).data
        assert 'order' in data
        assert data['order'] is not None

    def test_includes_timestamps(self):
        event = EventFactory()
        data = EventSerializer(event).data
        assert 'created_at' in data
        assert 'updated_at' in data

    def test_message_field_present(self):
        event = EventFactory(message='Test message')
        data = EventSerializer(event).data
        assert data['message'] == 'Test message'

    def test_status_field_correct(self):
        event = EventFactory(status='ordered')
        data = EventSerializer(event).data
        assert data['status'] == 'ordered'

    def test_expected_fields_present(self):
        event = EventFactory()
        data = EventSerializer(event).data
        expected = {'id', 'order', 'delivery_date', 'message', 'status', 'created_at', 'updated_at'}
        assert expected.issubset(set(data.keys()))
