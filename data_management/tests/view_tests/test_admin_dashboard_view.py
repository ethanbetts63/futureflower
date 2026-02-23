import pytest
from datetime import date, timedelta
from rest_framework.test import APIClient
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminDashboardView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self):
        return '/api/data/admin/dashboard/'

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)
        response = client.get(self._url())
        assert response.status_code == 403

    def test_requires_authentication(self):
        client = APIClient()
        response = client.get(self._url())
        assert response.status_code == 401

    def test_returns_three_buckets(self):
        response = self.client.get(self._url())
        assert response.status_code == 200
        assert 'to_order' in response.data
        assert 'ordered' in response.data
        assert 'delivered' in response.data

    def test_to_order_includes_scheduled_within_14_days(self):
        plan = UpfrontPlanFactory()
        event = EventFactory(status='scheduled', order=plan, delivery_date=date.today() + timedelta(days=7))
        response = self.client.get(self._url())
        ids = [e['id'] for e in response.data['to_order']]
        assert event.id in ids

    def test_to_order_excludes_scheduled_beyond_14_days(self):
        plan = UpfrontPlanFactory()
        event = EventFactory(status='scheduled', order=plan, delivery_date=date.today() + timedelta(days=20))
        response = self.client.get(self._url())
        ids = [e['id'] for e in response.data['to_order']]
        assert event.id not in ids

    def test_ordered_events_in_ordered_bucket(self):
        from django.utils import timezone
        plan = UpfrontPlanFactory()
        event = EventFactory(status='ordered', order=plan, ordered_at=timezone.now())
        response = self.client.get(self._url())
        ids = [e['id'] for e in response.data['ordered']]
        assert event.id in ids

    def test_delivered_events_in_delivered_bucket(self):
        from django.utils import timezone
        plan = UpfrontPlanFactory()
        event = EventFactory(status='delivered', order=plan, delivered_at=timezone.now())
        response = self.client.get(self._url())
        ids = [e['id'] for e in response.data['delivered']]
        assert event.id in ids

    def test_to_order_excludes_ordered_events(self):
        from django.utils import timezone
        plan = UpfrontPlanFactory()
        ordered = EventFactory(status='ordered', order=plan, delivery_date=date.today() + timedelta(days=5))
        response = self.client.get(self._url())
        ids = [e['id'] for e in response.data['to_order']]
        assert ordered.id not in ids

    def test_buckets_are_lists(self):
        response = self.client.get(self._url())
        assert isinstance(response.data['to_order'], list)
        assert isinstance(response.data['ordered'], list)
        assert isinstance(response.data['delivered'], list)
