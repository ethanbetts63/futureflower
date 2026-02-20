import pytest
from decimal import Decimal
from payments.utils.webhook_handlers import handle_payment_intent_succeeded, handle_invoice_payment_succeeded
from payments.tests.factories.payment_factory import PaymentFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.models import Event


@pytest.mark.django_db
class TestWebhookCommissionAmount:

    def test_upfront_plan_events_get_commission_amount(self, mocker):
        """Events bulk-created for an upfront plan have commission_amount set from budget."""
        mocker.patch('payments.utils.webhook_handlers.send_customer_payment_notification')

        # budget=150 → tier gives $10
        plan = UpfrontPlanFactory(status='pending_payment', budget=Decimal('150'), frequency='annually', years=1)
        payment = PaymentFactory(
            user=plan.user,
            order=plan.orderbase_ptr,
            stripe_payment_intent_id='pi_upfront_test',
            status='pending',
        )

        payment_intent = {
            'id': 'pi_upfront_test',
            'metadata': {'item_type': 'UPFRONT_PLAN_NEW'},
            'payment_method': 'pm_test',
        }
        handle_payment_intent_succeeded(payment_intent)

        events = Event.objects.filter(order=plan.orderbase_ptr)
        assert events.exists()
        for event in events:
            assert event.commission_amount == Decimal('10')

    def test_upfront_plan_commission_amount_varies_with_budget(self, mocker):
        """Commission amount snapshot reflects the tier for the plan's budget."""
        mocker.patch('payments.utils.webhook_handlers.send_customer_payment_notification')

        # budget=75 → tier gives $5
        plan = UpfrontPlanFactory(status='pending_payment', budget=Decimal('75'), frequency='annually', years=1)
        payment = PaymentFactory(
            user=plan.user,
            order=plan.orderbase_ptr,
            stripe_payment_intent_id='pi_upfront_test2',
            status='pending',
        )

        payment_intent = {
            'id': 'pi_upfront_test2',
            'metadata': {'item_type': 'UPFRONT_PLAN_NEW'},
            'payment_method': 'pm_test',
        }
        handle_payment_intent_succeeded(payment_intent)

        event = Event.objects.filter(order=plan.orderbase_ptr).first()
        assert event.commission_amount == Decimal('5')

    def test_subscription_plan_first_event_gets_commission_amount(self, mocker):
        """First event created for a new subscription has commission_amount set."""
        mocker.patch('payments.utils.webhook_handlers.send_customer_payment_notification')

        # stripe_subscription_id already set → skips Stripe Subscription.create block
        plan = SubscriptionPlanFactory(
            status='pending_payment',
            budget=Decimal('200'),
            stripe_subscription_id='sub_existing',
        )
        payment = PaymentFactory(
            user=plan.user,
            order=plan.orderbase_ptr,
            stripe_payment_intent_id='pi_sub_test',
            status='pending',
        )

        payment_intent = {
            'id': 'pi_sub_test',
            'metadata': {'item_type': 'SUBSCRIPTION_PLAN_NEW'},
            'payment_method': 'pm_test',
        }
        handle_payment_intent_succeeded(payment_intent)

        event = Event.objects.filter(order=plan.orderbase_ptr).first()
        assert event is not None
        # budget=200 → tier gives $15
        assert event.commission_amount == Decimal('15')

    def test_recurring_subscription_event_gets_commission_amount(self, mocker):
        """Recurring subscription invoice creates an event with commission_amount."""
        from django.conf import settings
        from datetime import date, timedelta

        # budget=250 → tier gives $25
        plan = SubscriptionPlanFactory(
            status='active',
            budget=Decimal('250'),
            stripe_subscription_id='sub_recurring',
        )

        # Provide a created timestamp so the handler can compute delivery_date
        lead_days = getattr(settings, 'SUBSCRIPTION_CHARGE_LEAD_DAYS', 14)
        today = date.today()
        invoice_created_ts = int(__import__('datetime').datetime.combine(today, __import__('datetime').time.min).timestamp())
        expected_delivery_date = today + timedelta(days=lead_days)

        invoice = {
            'subscription': 'sub_recurring',
            'payment_intent': 'pi_recurring_test',
            'amount_paid': 25000,
            'created': invoice_created_ts,
        }
        handle_invoice_payment_succeeded(invoice)

        event = Event.objects.filter(order=plan.orderbase_ptr, delivery_date=expected_delivery_date).first()
        assert event is not None
        assert event.commission_amount == Decimal('25')
