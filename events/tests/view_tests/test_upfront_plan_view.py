import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from decimal import Decimal
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory
from events.utils.upfront_price_calc import forever_flower_upfront_price
from events.models import Event
from data_management.models.notification import Notification

@pytest.mark.django_db
class TestUpfrontPlanViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/upfront-plans/'

    def test_create_plan_calculates_price(self):
        data = {
            "budget": "100.00",
            "frequency": "quarterly",
            "years": 5,
            "recipient_first_name": "Test",
            "recipient_last_name": "User",
            "recipient_street_address": "123 Street",
            "recipient_suburb": "Suburb",
            "recipient_city": "City",
            "recipient_state": "State",
            "recipient_postcode": "1234",
            "recipient_country": "US"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201
        
        plan_id = response.data['id']
        from events.models import UpfrontPlan
        plan = UpfrontPlan.objects.get(id=plan_id)
        
        expected_price, _ = forever_flower_upfront_price(100, "quarterly", 5)
        assert abs(plan.total_amount - Decimal(str(expected_price))) < Decimal('0.01')

    def test_partial_update_validates_price(self):
        plan = UpfrontPlanFactory(user=self.user, budget=100, frequency='annually', years=1)
        detail_url = f"{self.url}{plan.id}/"
        
        # Calculate what the server expects
        server_price, _ = forever_flower_upfront_price(150, "annually", 1)
        
        # Try with wrong price
        data = {
            "budget": "150.00",
            "frequency": "annually",
            "years": 1,
            "total_amount": str(server_price + 10) # Incorrect
        }
        response = self.client.patch(detail_url, data, format='json')
        assert response.status_code == 400
        assert "Price mismatch" in response.data['error']

        # Try with correct price
        data["total_amount"] = str(server_price)
        response = self.client.patch(detail_url, data, format='json')
        assert response.status_code == 200
        
    def test_get_latest_pending_plan(self):
        # Create an active plan
        UpfrontPlanFactory(user=self.user, status='active')
        # Create a pending plan
        pending = UpfrontPlanFactory(user=self.user, status='pending_payment')
        
        url = f"{self.url}get-latest-pending/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == pending.id

    def test_get_latest_pending_none(self):
        url = f"{self.url}get-latest-pending/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data is None

    def test_filter_exclude_single_delivery(self):
        # Single delivery plan (1 year, annually)
        UpfrontPlanFactory(user=self.user, years=1, frequency='annually')
        # Multi-year plan
        UpfrontPlanFactory(user=self.user, years=5, frequency='quarterly')

        # Default: returns all
        response = self.client.get(self.url)
        assert len(response.data) == 2

        # Filtered: exclude single delivery
        response = self.client.get(f"{self.url}?exclude_single_delivery=true")
        assert len(response.data) == 1
        assert response.data[0]['years'] == 5


def make_notification(event, status='pending'):
    return Notification.objects.create(
        recipient_type='admin',
        channel='email',
        body='Test',
        scheduled_for=event.delivery_date,
        status=status,
        related_event=event,
    )


@pytest.mark.django_db
class TestUpfrontPlanCancelAction:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.base_url = '/api/events/upfront-plans/'

    def _cancel_url(self, plan_id):
        return f'{self.base_url}{plan_id}/cancel/'

    def test_unauthenticated_cannot_cancel(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        self.client.force_authenticate(user=None)
        response = self.client.post(self._cancel_url(plan.id), format='json')
        assert response.status_code == 401

    def test_cannot_cancel_other_users_plan(self):
        other_plan = UpfrontPlanFactory(user=UserFactory(), status='active')
        response = self.client.post(self._cancel_url(other_plan.id), format='json')
        assert response.status_code == 404

    def test_cannot_cancel_non_active_plan(self):
        plan = UpfrontPlanFactory(user=self.user, status='cancelled')
        response = self.client.post(self._cancel_url(plan.id), format='json')
        assert response.status_code == 400

    def test_cancel_marks_plan_cancelled(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        response = self.client.post(self._cancel_url(plan.id), format='json')
        assert response.status_code == 200
        plan.refresh_from_db()
        assert plan.status == 'cancelled'

    def test_cancel_cancels_all_scheduled_events(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        e1 = EventFactory(order=plan, status='scheduled')
        e2 = EventFactory(order=plan, status='scheduled')

        self.client.post(self._cancel_url(plan.id), format='json')

        e1.refresh_from_db()
        e2.refresh_from_db()
        assert e1.status == 'cancelled'
        assert e2.status == 'cancelled'

    def test_cancel_does_not_touch_delivered_events(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        delivered = EventFactory(order=plan, status='delivered')

        self.client.post(self._cancel_url(plan.id), format='json')

        delivered.refresh_from_db()
        assert delivered.status == 'delivered'

    def test_cancel_cancels_pending_notifications(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        event = EventFactory(order=plan, status='scheduled')
        notif = make_notification(event, status='pending')

        self.client.post(self._cancel_url(plan.id), format='json')

        notif.refresh_from_db()
        assert notif.status == 'cancelled'

    def test_ordered_events_trigger_admin_notification(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        EventFactory(order=plan, status='ordered')

        with patch('events.views.upfront_plan_view.send_admin_cancellation_notification') as mock_notify:
            self.client.post(self._cancel_url(plan.id), format='json')

        mock_notify.assert_called_once()

    def test_no_ordered_events_no_admin_notification(self):
        plan = UpfrontPlanFactory(user=self.user, status='active')
        EventFactory(order=plan, status='scheduled')

        with patch('events.views.upfront_plan_view.send_admin_cancellation_notification') as mock_notify:
            self.client.post(self._cancel_url(plan.id), format='json')

        mock_notify.assert_not_called()
