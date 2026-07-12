import pytest
from rest_framework.test import APIClient
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.order_factory import OrderFactory

@pytest.mark.django_db
class TestEventViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/'

    def test_get_queryset_filters_by_user(self):
        plan = OrderFactory(billing_mode='one_time', user=self.user)
        EventFactory(order=plan)
        
        other_user = UserFactory()
        other_plan = OrderFactory(billing_mode='one_time', user=other_user)
        EventFactory(order=other_plan)
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_retrieve_event(self):
        plan = OrderFactory(billing_mode='one_time', user=self.user)
        event = EventFactory(order=plan)
        
        url = f"{self.url}{event.id}/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == event.id

    def test_retrieve_other_user_event_fails(self):
        other_user = UserFactory()
        other_plan = OrderFactory(billing_mode='one_time', user=other_user)
        event = EventFactory(order=other_plan)
        
        url = f"{self.url}{event.id}/"
        response = self.client.get(url)
        assert response.status_code == 404
