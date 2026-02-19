import pytest
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.tests.factories.event_factory import EventFactory
from events.models import SubscriptionPlan, Event
from data_management.models.notification import Notification
from payments.utils.webhook_handlers import handle_subscription_deleted


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
class TestHandleSubscriptionDeleted:

    def test_active_plan_is_marked_cancelled(self):
        plan = SubscriptionPlanFactory(status='active', stripe_subscription_id='sub_test_1')

        handle_subscription_deleted({'id': 'sub_test_1'})

        plan.refresh_from_db()
        assert plan.status == 'cancelled'

    def test_scheduled_events_are_cancelled(self):
        plan = SubscriptionPlanFactory(status='active', stripe_subscription_id='sub_test_2')
        e1 = EventFactory(order=plan, status='scheduled')
        e2 = EventFactory(order=plan, status='scheduled')

        handle_subscription_deleted({'id': 'sub_test_2'})

        e1.refresh_from_db()
        e2.refresh_from_db()
        assert e1.status == 'cancelled'
        assert e2.status == 'cancelled'

    def test_delivered_events_are_not_touched(self):
        plan = SubscriptionPlanFactory(status='active', stripe_subscription_id='sub_test_3')
        delivered = EventFactory(order=plan, status='delivered')

        handle_subscription_deleted({'id': 'sub_test_3'})

        delivered.refresh_from_db()
        assert delivered.status == 'delivered'

    def test_pending_notifications_cancelled_when_event_cancelled(self):
        plan = SubscriptionPlanFactory(status='active', stripe_subscription_id='sub_test_4')
        event = EventFactory(order=plan, status='scheduled')
        notif = make_notification(event, status='pending')

        handle_subscription_deleted({'id': 'sub_test_4'})

        notif.refresh_from_db()
        assert notif.status == 'cancelled'

    def test_already_cancelled_plan_is_skipped(self):
        plan = SubscriptionPlanFactory(status='cancelled', stripe_subscription_id='sub_test_5')
        scheduled = EventFactory(order=plan, status='scheduled')

        handle_subscription_deleted({'id': 'sub_test_5'})

        # Plan was already cancelled — no further changes should be made
        scheduled.refresh_from_db()
        assert scheduled.status == 'scheduled'

    def test_unknown_subscription_id_does_not_raise(self):
        # Should log and return gracefully, not raise
        handle_subscription_deleted({'id': 'sub_nonexistent'})

    def test_missing_id_does_not_raise(self):
        handle_subscription_deleted({})

    def test_ordered_events_are_not_cancelled(self):
        """Ordered events are left alone — the florist may already be acting on them."""
        plan = SubscriptionPlanFactory(status='active', stripe_subscription_id='sub_test_6')
        ordered = EventFactory(order=plan, status='ordered')

        handle_subscription_deleted({'id': 'sub_test_6'})

        ordered.refresh_from_db()
        assert ordered.status == 'ordered'
