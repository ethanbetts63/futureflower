import pytest
from rest_framework.test import APIClient
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminEventDetailView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self, pk):
        return f'/api/data/admin/events/{pk}/'

    def test_returns_event_data(self):
        event = EventFactory()
        response = self.client.get(self._url(event.pk))
        assert response.status_code == 200
        assert response.data['id'] == event.pk

    def test_returns_404_for_nonexistent_event(self):
        response = self.client.get(self._url(99999))
        assert response.status_code == 404

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)
        event = EventFactory()
        response = client.get(self._url(event.pk))
        assert response.status_code == 403

    def test_requires_authentication(self):
        client = APIClient()
        event = EventFactory()
        response = client.get(self._url(event.pk))
        assert response.status_code == 401

    def test_response_includes_delivery_date(self):
        event = EventFactory()
        response = self.client.get(self._url(event.pk))
        assert 'delivery_date' in response.data

    def test_response_includes_status(self):
        event = EventFactory(status='ordered')
        response = self.client.get(self._url(event.pk))
        assert response.data['status'] == 'ordered'
