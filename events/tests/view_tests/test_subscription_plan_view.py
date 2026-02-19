import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from decimal import Decimal
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory
from events.models import Event
from data_management.models.notification import Notification

@pytest.mark.django_db
class TestSubscriptionPlanViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/subscription-plans/'

    def test_get_queryset_filters_by_user(self):
        SubscriptionPlanFactory(user=self.user)
        SubscriptionPlanFactory(user=UserFactory()) # Other user
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_get_or_create_pending(self):
        url = f"{self.url}get-or-create-pending/"
        
        # First call creates
        response = self.client.get(url)
        assert response.status_code == 201
        plan_id = response.data['id']
        
        # Second call retrieves
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == plan_id

    def test_calculate_price(self):
        plan = SubscriptionPlanFactory(user=self.user)
        url = f"{self.url}{plan.id}/calculate-price/"
        
        # 100 + 0 = 100
        response = self.client.post(url, {"budget": "100.00"}, format='json')
        assert response.status_code == 200
        assert Decimal(response.data['total_amount']) == Decimal('100.00')

    def test_calculate_price_invalid(self):
        plan = SubscriptionPlanFactory(user=self.user)
        url = f"{self.url}{plan.id}/calculate-price/"

        response = self.client.post(url, {"budget": "invalid"}, format='json')
        assert response.status_code == 400


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
class TestSubscriptionPlanCancelAction:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.base_url = '/api/events/subscription-plans/'

    def _cancel_url(self, plan_id):
        return f'{self.base_url}{plan_id}/cancel/'

    def test_unauthenticated_cannot_cancel(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        self.client.force_authenticate(user=None)
        response = self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')
        assert response.status_code == 401

    def test_cannot_cancel_other_users_plan(self):
        other_plan = SubscriptionPlanFactory(user=UserFactory(), status='active')
        with patch('events.views.subscription_plan_view.stripe'):
            response = self.client.post(self._cancel_url(other_plan.id), {'cancel_type': 'cancel_all'}, format='json')
        assert response.status_code == 404

    def test_cannot_cancel_non_active_plan(self):
        plan = SubscriptionPlanFactory(user=self.user, status='cancelled')
        response = self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')
        assert response.status_code == 400
        assert 'active' in response.data['error']

    def test_invalid_cancel_type_returns_400(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        with patch('events.views.subscription_plan_view.stripe'):
            response = self.client.post(self._cancel_url(plan.id), {'cancel_type': 'invalid'}, format='json')
        assert response.status_code == 400

    def test_cancel_all_marks_plan_cancelled(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        with patch('events.views.subscription_plan_view.stripe'):
            response = self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')
        assert response.status_code == 200
        plan.refresh_from_db()
        assert plan.status == 'cancelled'

    def test_cancel_all_cancels_all_scheduled_events(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        e1 = EventFactory(order=plan, status='scheduled')
        e2 = EventFactory(order=plan, status='scheduled')

        with patch('events.views.subscription_plan_view.stripe'):
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')

        e1.refresh_from_db()
        e2.refresh_from_db()
        assert e1.status == 'cancelled'
        assert e2.status == 'cancelled'

    def test_cancel_all_cancels_pending_notifications(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        event = EventFactory(order=plan, status='scheduled')
        notif = make_notification(event, status='pending')

        with patch('events.views.subscription_plan_view.stripe'):
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')

        notif.refresh_from_db()
        assert notif.status == 'cancelled'

    def test_keep_current_preserves_earliest_scheduled_event(self):
        from datetime import date, timedelta
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        today = date.today()
        earliest = EventFactory(order=plan, status='scheduled', delivery_date=today + timedelta(days=7))
        later = EventFactory(order=plan, status='scheduled', delivery_date=today + timedelta(days=30))

        with patch('events.views.subscription_plan_view.stripe'):
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'keep_current'}, format='json')

        earliest.refresh_from_db()
        later.refresh_from_db()
        assert earliest.status == 'scheduled'
        assert later.status == 'cancelled'

    def test_keep_current_with_single_event_cancels_nothing(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        only_event = EventFactory(order=plan, status='scheduled')

        with patch('events.views.subscription_plan_view.stripe'):
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'keep_current'}, format='json')

        only_event.refresh_from_db()
        assert only_event.status == 'scheduled'

    def test_ordered_events_trigger_admin_notification(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        EventFactory(order=plan, status='ordered')

        with patch('events.views.subscription_plan_view.stripe'), \
             patch('events.views.subscription_plan_view.send_admin_cancellation_notification') as mock_notify:
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')

        mock_notify.assert_called_once()

    def test_no_ordered_events_no_admin_notification(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active')
        EventFactory(order=plan, status='scheduled')

        with patch('events.views.subscription_plan_view.stripe'), \
             patch('events.views.subscription_plan_view.send_admin_cancellation_notification') as mock_notify:
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')

        mock_notify.assert_not_called()

    def test_stripe_subscription_is_cancelled(self):
        plan = SubscriptionPlanFactory(user=self.user, status='active', stripe_subscription_id='sub_xyz')
        mock_stripe = MagicMock()

        with patch('events.views.subscription_plan_view.stripe', mock_stripe):
            self.client.post(self._cancel_url(plan.id), {'cancel_type': 'cancel_all'}, format='json')

        mock_stripe.Subscription.cancel.assert_called_once_with('sub_xyz')
