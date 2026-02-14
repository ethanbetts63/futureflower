import pytest
from decimal import Decimal
from unittest.mock import MagicMock
from events.models import UpfrontPlan, SubscriptionPlan, Event
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from payments.models import Payment
from payments.utils.webhook_handlers import handle_payment_intent_succeeded, handle_invoice_payment_succeeded

@pytest.mark.django_db
class TestEventGeneration:
    def test_upfront_plan_activation_creates_events(self):
        plan = UpfrontPlanFactory(status='pending_payment', years=1, frequency='quarterly')
        # Create the Payment object that the handler expects to find
        payment = Payment.objects.create(
            user=plan.user,
            order=plan.orderbase_ptr,
            stripe_payment_intent_id="pi_123",
            amount=plan.total_amount,
            status='pending'
        )

        mock_pi = {
            'id': 'pi_123',
            'metadata': {
                'item_type': 'UPFRONT_PLAN_NEW'
            }
        }

        handle_payment_intent_succeeded(mock_pi)

        plan.refresh_from_db()
        assert plan.status == 'active'
        assert Event.objects.filter(order=plan.orderbase_ptr).count() == 4

    def test_subscription_invoice_creates_single_event(self):
        plan = SubscriptionPlanFactory(status='active', frequency='monthly')
        
        mock_invoice = {
            'subscription': plan.stripe_subscription_id,
            'payment_intent': 'pi_sub_123',
            'amount_paid': 10000 # $100.00
        }

        # Initially no events
        assert Event.objects.filter(order=plan.orderbase_ptr).count() == 0

        handle_invoice_payment_succeeded(mock_invoice)

        # Should create 1 payment and 1 event
        assert Payment.objects.filter(stripe_payment_intent_id='pi_sub_123').exists()
        assert Event.objects.filter(order=plan.orderbase_ptr).count() == 1
