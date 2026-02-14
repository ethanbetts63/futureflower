import pytest
from rest_framework.test import APIClient
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestEventViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/'

    def test_get_queryset_filters_by_user(self):
        plan = UpfrontPlanFactory(user=self.user)
        EventFactory(order=plan.orderbase_ptr)
        
        other_user = UserFactory()
        other_plan = UpfrontPlanFactory(user=other_user)
        EventFactory(order=other_plan.orderbase_ptr)
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_retrieve_event(self):
        plan = UpfrontPlanFactory(user=self.user)
        event = EventFactory(order=plan.orderbase_ptr)
        
        url = f"{self.url}{event.id}/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == event.id

    def test_retrieve_other_user_event_fails(self):
        other_user = UserFactory()
        other_plan = UpfrontPlanFactory(user=other_user)
        event = EventFactory(order=other_plan.orderbase_ptr)
        
        url = f"{self.url}{event.id}/"
        response = self.client.get(url)
        assert response.status_code == 404
