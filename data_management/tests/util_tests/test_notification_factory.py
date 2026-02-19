import pytest
from datetime import date, timedelta
from data_management.models.notification import Notification
from data_management.utils.notification_factory import create_customer_delivery_day_notification
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestCreateCustomerDeliveryDayNotification:

    def test_creates_notification_with_correct_fields(self):
        user = UserFactory(first_name='Alice')
        plan = UpfrontPlanFactory(user=user)
        delivery_date = date.today() + timedelta(days=10)
        event = EventFactory(order=plan, delivery_date=delivery_date)

        create_customer_delivery_day_notification(event)

        notif = Notification.objects.get(related_event=event, recipient_type='customer')
        assert notif.recipient_user == user
        assert notif.channel == 'email'
        assert notif.scheduled_for == delivery_date
        assert notif.subject == "Your FutureFlower delivery is today!"
        assert notif.status == 'pending'

    def test_body_contains_recipient_name(self):
        plan = UpfrontPlanFactory(
            recipient_first_name='Jane',
            recipient_last_name='Doe',
        )
        event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))

        create_customer_delivery_day_notification(event)

        notif = Notification.objects.get(related_event=event, recipient_type='customer')
        assert 'Jane Doe' in notif.body

    def test_body_includes_next_delivery_date_when_future_event_exists(self):
        plan = UpfrontPlanFactory()
        first_event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))
        next_event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=20))

        create_customer_delivery_day_notification(first_event)

        notif = Notification.objects.get(related_event=first_event, recipient_type='customer')
        assert str(next_event.delivery_date) in notif.body

    def test_body_omits_next_delivery_line_when_no_future_event(self):
        plan = UpfrontPlanFactory()
        event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))

        create_customer_delivery_day_notification(event)

        notif = Notification.objects.get(related_event=event, recipient_type='customer')
        assert 'next delivery' not in notif.body

    def test_next_delivery_date_is_scoped_to_same_order(self):
        """An event on a different order does not appear as the next delivery."""
        plan = UpfrontPlanFactory()
        other_plan = UpfrontPlanFactory()
        event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))
        EventFactory(order=other_plan, delivery_date=date.today() + timedelta(days=20))

        create_customer_delivery_day_notification(event)

        notif = Notification.objects.get(related_event=event, recipient_type='customer')
        assert 'next delivery' not in notif.body

    def test_uses_username_as_fallback_when_first_name_is_blank(self):
        user = UserFactory(first_name='', username='janedoe99')
        plan = UpfrontPlanFactory(user=user)
        event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))

        create_customer_delivery_day_notification(event)

        notif = Notification.objects.get(related_event=event, recipient_type='customer')
        assert 'janedoe99' in notif.body

    def test_only_next_event_is_referenced_not_the_one_after(self):
        """Confirms we pick the immediately next event, not a later one."""
        plan = UpfrontPlanFactory()
        first_event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=10))
        next_event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=20))
        far_event = EventFactory(order=plan, delivery_date=date.today() + timedelta(days=30))

        create_customer_delivery_day_notification(first_event)

        notif = Notification.objects.get(related_event=first_event, recipient_type='customer')
        assert str(next_event.delivery_date) in notif.body
        assert str(far_event.delivery_date) not in notif.body
