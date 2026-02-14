import pytest
import json
from rest_framework.test import APIClient
import stripe
from payments.models import Payment
from payments.tests.factories.payment_factory import PaymentFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory

@pytest.mark.django_db
class TestStripeWebhookView:

    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/payments/webhook/'

    def _get_webhook_event(self, event_type, object_data):
        return {
            'type': event_type,
            'data': {
                'object': object_data
            }
        }

    def test_webhook_payment_intent_succeeded(self, mocker):
        plan = UpfrontPlanFactory(status='pending_payment')
        payment = PaymentFactory(order=plan.orderbase_ptr, stripe_payment_intent_id='pi_123', status='pending')
        
        pi_data = {
            'id': 'pi_123',
            'object': 'payment_intent',
            'metadata': {'item_type': 'UPFRONT_PLAN_NEW'}
        }
        webhook_event = self._get_webhook_event('payment_intent.succeeded', pi_data)
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)

        response = self.client.post(self.url, data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')

        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.status == 'succeeded'
        plan.refresh_from_db()
        assert plan.status == 'active'

    def test_webhook_payment_intent_failed(self, mocker):
        payment = PaymentFactory(stripe_payment_intent_id='pi_456', status='pending')
        
        pi_data = {
            'id': 'pi_456',
            'object': 'payment_intent',
            'metadata': {}
        }
        webhook_event = self._get_webhook_event('payment_intent.payment_failed', pi_data)
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)

        response = self.client.post(self.url, data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')

        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.status == 'failed'

    def test_invalid_signature(self, mocker):
        mocker.patch.object(stripe.Webhook, 'construct_event', side_effect=stripe.error.SignatureVerificationError('bad sig', 'sig_123'))
        response = self.client.post(self.url, data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        assert response.status_code == 400

    def test_invalid_payload(self, mocker):
        mocker.patch.object(stripe.Webhook, 'construct_event', side_effect=ValueError)
        response = self.client.post(self.url, data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        assert response.status_code == 400

    def test_webhook_setup_intent_succeeded(self, mocker):
        from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
        plan = SubscriptionPlanFactory(status='pending_payment')
        
        si_data = {
            'id': 'si_123',
            'object': 'setup_intent',
            'metadata': {'subscription_plan_id': str(plan.id)}
        }
        webhook_event = self._get_webhook_event('setup_intent.succeeded', si_data)
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)

        response = self.client.post(self.url, data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')

        assert response.status_code == 200
        plan.refresh_from_db()
        assert plan.status == 'active'
