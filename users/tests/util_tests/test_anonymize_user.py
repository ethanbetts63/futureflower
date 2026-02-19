import pytest
from unittest.mock import patch, MagicMock
from django.conf import settings
from users.utils.anonymize_user import anonymize_user
from users.utils.hash_value import hash_value
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.tests.factories.event_factory import EventFactory
from events.models import UpfrontPlan, SubscriptionPlan, Event
from data_management.models.notification import Notification


def make_notification(event, status='pending'):
    return Notification.objects.create(
        recipient_type='admin',
        channel='email',
        body='Test notification',
        scheduled_for=event.delivery_date,
        status=status,
        related_event=event,
    )


@pytest.mark.django_db
class TestAnonymizeUserUpfrontPlans:

    def test_pending_upfront_plans_are_deleted(self):
        user = UserFactory()
        pending = UpfrontPlanFactory(user=user, status='pending_payment')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        assert not UpfrontPlan.objects.filter(pk=pending.pk).exists()

    def test_active_upfront_plan_recipient_names_are_hashed(self):
        user = UserFactory()
        plan = UpfrontPlanFactory(
            user=user,
            status='active',
            recipient_first_name='Jane',
            recipient_last_name='Smith',
        )
        salt = settings.HASHING_SALT

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        plan.refresh_from_db()
        assert plan.recipient_first_name is None
        assert plan.recipient_last_name is None
        assert plan.hash_recipient_first_name == hash_value('Jane', salt)
        assert plan.hash_recipient_last_name == hash_value('Smith', salt)

    def test_active_upfront_plan_street_address_is_not_hashed(self):
        """Address fields are intentionally not hashed — only names are."""
        user = UserFactory()
        plan = UpfrontPlanFactory(
            user=user,
            status='active',
            recipient_street_address='123 Main St',
        )

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        plan.refresh_from_db()
        # No hash field for address — confirms field was removed from hashing dict
        assert not hasattr(plan, 'hash_recipient_street_address')

    def test_active_upfront_plan_non_delivered_events_deleted(self):
        user = UserFactory()
        plan = UpfrontPlanFactory(user=user, status='active')
        delivered = EventFactory(order=plan, status='delivered')
        scheduled = EventFactory(order=plan, status='scheduled')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        assert Event.objects.filter(pk=delivered.pk).exists()
        assert not Event.objects.filter(pk=scheduled.pk).exists()


@pytest.mark.django_db
class TestAnonymizeUserSubscriptionPlans:

    def test_pending_subscription_plans_are_deleted(self):
        user = UserFactory()
        pending = SubscriptionPlanFactory(user=user, status='pending_payment')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        assert not SubscriptionPlan.objects.filter(pk=pending.pk).exists()

    def test_active_subscription_stripe_is_cancelled_before_data_wipe(self):
        user = UserFactory()
        plan = SubscriptionPlanFactory(
            user=user,
            status='active',
            stripe_subscription_id='sub_abc123',
        )
        mock_stripe = MagicMock()

        with patch('users.utils.anonymize_user.stripe', mock_stripe):
            anonymize_user(user)

        mock_stripe.Subscription.cancel.assert_called_once_with('sub_abc123')

    def test_stripe_error_during_cancel_is_swallowed(self):
        """A Stripe error during anonymization should not abort the whole process."""
        import stripe as real_stripe
        user = UserFactory()
        SubscriptionPlanFactory(
            user=user,
            status='active',
            stripe_subscription_id='sub_bad',
        )
        mock_stripe = MagicMock()
        mock_stripe.Subscription.cancel.side_effect = real_stripe.error.StripeError('failed')
        mock_stripe.error = real_stripe.error

        with patch('users.utils.anonymize_user.stripe', mock_stripe):
            anonymize_user(user)  # should not raise

        user.refresh_from_db()
        assert user.is_active is False

    def test_active_subscription_recipient_names_are_hashed(self):
        user = UserFactory()
        plan = SubscriptionPlanFactory(
            user=user,
            status='active',
            recipient_first_name='Alice',
            recipient_last_name='Wonder',
        )
        salt = settings.HASHING_SALT

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        plan.refresh_from_db()
        assert plan.recipient_first_name is None
        assert plan.recipient_last_name is None
        assert plan.hash_recipient_first_name == hash_value('Alice', salt)
        assert plan.hash_recipient_last_name == hash_value('Wonder', salt)

    def test_pending_notifications_for_subscription_events_are_cancelled(self):
        user = UserFactory()
        plan = SubscriptionPlanFactory(user=user, status='active')
        event = EventFactory(order=plan, status='scheduled')
        notif = make_notification(event, status='pending')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        notif.refresh_from_db()
        assert notif.status == 'cancelled'

    def test_sent_notifications_are_not_touched(self):
        user = UserFactory()
        plan = SubscriptionPlanFactory(user=user, status='active')
        event = EventFactory(order=plan, status='delivered')
        notif = make_notification(event, status='sent')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        notif.refresh_from_db()
        assert notif.status == 'sent'

    def test_non_delivered_subscription_events_deleted(self):
        user = UserFactory()
        plan = SubscriptionPlanFactory(user=user, status='active')
        delivered = EventFactory(order=plan, status='delivered')
        scheduled = EventFactory(order=plan, status='scheduled')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        assert Event.objects.filter(pk=delivered.pk).exists()
        assert not Event.objects.filter(pk=scheduled.pk).exists()


@pytest.mark.django_db
class TestAnonymizeUserPii:

    def test_user_pii_is_hashed_and_wiped(self):
        user = UserFactory(first_name='John', last_name='Doe', email='john@example.com')
        salt = settings.HASHING_SALT

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        user.refresh_from_db()
        assert user.first_name == ''
        assert user.last_name == ''
        assert user.hash_first_name == hash_value('John', salt)
        assert user.hash_last_name == hash_value('Doe', salt)
        assert user.hash_email == hash_value('john@example.com', salt)

    def test_email_replaced_with_placeholder(self):
        user = UserFactory(email='real@email.com')

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        user.refresh_from_db()
        assert user.email == f'deleted_{user.pk}@deleted.com'

    def test_user_is_deactivated(self):
        user = UserFactory()

        with patch('users.utils.anonymize_user.stripe'):
            anonymize_user(user)

        user.refresh_from_db()
        assert user.is_active is False
        assert user.anonymized_at is not None
