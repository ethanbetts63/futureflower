import pytest
from unittest.mock import patch, MagicMock
from payments.utils.send_admin_payment_notification import (
    send_admin_payment_notification,
    send_admin_cancellation_notification,
)
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory


def _make_mock_response():
    mock = MagicMock()
    mock.raise_for_status.return_value = None
    return mock


@pytest.mark.django_db
class TestSendAdminPaymentNotification:

    def test_sends_email_when_config_present(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=_make_mock_response()) as mock_post, \
             patch('payments.utils.send_admin_payment_notification.Client') as mock_twilio:
            mock_twilio.return_value.messages.create.return_value = None
            send_admin_payment_notification('pay_123')

        mock_post.assert_called_once()

    def test_skips_when_admin_email_missing(self, settings):
        settings.ADMIN_EMAIL = ''
        settings.ADMIN_NUMBER = '+15550001111'

        with patch('payments.utils.send_admin_payment_notification.requests.post') as mock_post:
            send_admin_payment_notification('pay_456')

        mock_post.assert_not_called()

    def test_skips_when_admin_number_missing(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = ''

        with patch('payments.utils.send_admin_payment_notification.requests.post') as mock_post:
            send_admin_payment_notification('pay_789')

        mock_post.assert_not_called()

    def test_does_not_raise_on_mailgun_error(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception('503 error')

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=mock_response):
            send_admin_payment_notification('pay_fail')  # must not raise

    def test_sends_to_admin_email_address(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=_make_mock_response()) as mock_post, \
             patch('payments.utils.send_admin_payment_notification.Client') as mock_twilio:
            mock_twilio.return_value.messages.create.return_value = None
            send_admin_payment_notification('pay_addr')

        call_data = mock_post.call_args.kwargs['data']
        assert 'admin@example.com' in call_data['to']

    def test_with_order_includes_order_context(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        plan = UpfrontPlanFactory(recipient_first_name='Jane', recipient_last_name='Smith')

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=_make_mock_response()) as mock_post, \
             patch('payments.utils.send_admin_payment_notification.Client') as mock_twilio:
            mock_twilio.return_value.messages.create.return_value = None
            send_admin_payment_notification('pay_ctx', order=plan)

        mock_post.assert_called_once()


@pytest.mark.django_db
class TestSendAdminCancellationNotification:

    def test_sends_email_and_sms(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=_make_mock_response()) as mock_post, \
             patch('payments.utils.send_admin_payment_notification.Client') as mock_twilio:
            mock_client = mock_twilio.return_value
            mock_client.messages.create.return_value = None
            send_admin_cancellation_notification('Event on 2025-06-01')

        mock_post.assert_called_once()
        mock_client.messages.create.assert_called_once()

    def test_skips_when_config_missing(self, settings):
        settings.ADMIN_EMAIL = ''
        settings.ADMIN_NUMBER = '+15550001111'

        with patch('payments.utils.send_admin_payment_notification.requests.post') as mock_post:
            send_admin_cancellation_notification('some event')

        mock_post.assert_not_called()

    def test_does_not_raise_on_error(self, settings):
        settings.ADMIN_EMAIL = 'admin@example.com'
        settings.ADMIN_NUMBER = '+15550001111'
        settings.MAILGUN_DOMAIN = 'mg.example.com'
        settings.MAILGUN_API_KEY = 'key-test'
        settings.DEFAULT_FROM_EMAIL = 'no-reply@example.com'
        settings.TWILIO_ACCOUNT_SID = 'ACtest'
        settings.TWILIO_AUTH_TOKEN = 'authtest'
        settings.TWILIO_MESSAGING_SERVICE_SID = 'MGtest'

        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception('error')

        with patch('payments.utils.send_admin_payment_notification.requests.post',
                   return_value=mock_response):
            send_admin_cancellation_notification('event')  # must not raise
