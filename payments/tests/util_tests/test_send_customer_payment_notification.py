import pytest
from unittest.mock import patch, MagicMock
from payments.utils.send_customer_payment_notification import send_customer_payment_notification
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory


@pytest.mark.django_db
class TestSendCustomerPaymentNotification:

    def _make_mock_response(self):
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        return mock_response

    def test_sends_email_to_user_via_mailgun(self):
        user = UserFactory(email='customer@example.com')
        plan = UpfrontPlanFactory(user=user)

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
            return_value=self._make_mock_response(),
        ) as mock_post:
            send_customer_payment_notification(user, plan)

        mock_post.assert_called_once()
        assert 'customer@example.com' in mock_post.call_args.kwargs['data']['to']

    def test_email_body_contains_customer_first_name(self):
        user = UserFactory(first_name='Bob', email='bob@example.com')
        plan = UpfrontPlanFactory(user=user)

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
            return_value=self._make_mock_response(),
        ) as mock_post:
            send_customer_payment_notification(user, plan)

        body = mock_post.call_args.kwargs['data']['text']
        assert 'Bob' in body

    def test_email_body_contains_recipient_name(self):
        user = UserFactory(email='customer@example.com')
        plan = UpfrontPlanFactory(
            user=user,
            recipient_first_name='Carol',
            recipient_last_name='Smith',
        )

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
            return_value=self._make_mock_response(),
        ) as mock_post:
            send_customer_payment_notification(user, plan)

        body = mock_post.call_args.kwargs['data']['text']
        assert 'Carol Smith' in body

    def test_email_body_contains_start_date_and_budget(self):
        user = UserFactory(email='customer@example.com')
        plan = UpfrontPlanFactory(user=user)

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
            return_value=self._make_mock_response(),
        ) as mock_post:
            send_customer_payment_notification(user, plan)

        body = mock_post.call_args.kwargs['data']['text']
        assert str(plan.start_date) in body
        assert str(plan.budget) in body

    def test_skips_send_when_user_has_no_email(self):
        user = UserFactory(email='')
        plan = UpfrontPlanFactory(user=user)

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
        ) as mock_post:
            send_customer_payment_notification(user, plan)

        mock_post.assert_not_called()

    def test_mailgun_error_does_not_raise(self):
        user = UserFactory(email='fail@example.com')
        plan = UpfrontPlanFactory(user=user)

        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception('503 Service Unavailable')

        with patch(
            'payments.utils.send_customer_payment_notification.requests.post',
            return_value=mock_response,
        ):
            send_customer_payment_notification(user, plan)  # must not raise
