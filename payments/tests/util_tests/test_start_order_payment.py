from decimal import Decimal

import pytest
import stripe

from events.tests.factories.order_factory import OrderFactory
from users.tests.factories.user_factory import UserFactory
from payments.models import Payment
from payments.utils.checkout import (
    start_order_payment,
    validate_order_ready_for_payment,
)


@pytest.fixture
def stripe_intent(mocker):
    """Stand in for Stripe so no request leaves the test suite."""
    intent = mocker.Mock(id='pi_test_123', client_secret='pi_test_123_secret')
    return mocker.patch.object(stripe.PaymentIntent, 'create', return_value=intent)


@pytest.fixture(autouse=True)
def no_stripe_customer_call(mocker):
    mocker.patch(
        'payments.utils.checkout.ensure_stripe_customer',
        side_effect=lambda user: setattr(user, 'stripe_customer_id', 'cus_test_123'),
    )


@pytest.mark.django_db
class TestValidateOrderReadyForPayment:

    def test_zero_total_is_rejected(self):
        order = OrderFactory(budget=None)
        order.total_amount = Decimal('0')
        assert validate_order_ready_for_payment(order) == 'Order amount must be greater than zero.'

    def test_missing_total_is_rejected(self):
        order = OrderFactory(budget=None)
        order.total_amount = None
        assert validate_order_ready_for_payment(order) == 'Order amount must be greater than zero.'

    def test_recurring_without_a_frequency_is_rejected(self):
        order = OrderFactory(billing_mode='recurring', budget=Decimal('80.00'), frequency=None)
        assert validate_order_ready_for_payment(order) == 'Subscription details are incomplete.'

    def test_a_complete_one_off_order_is_ready(self):
        order = OrderFactory(budget=Decimal('80.00'))
        assert validate_order_ready_for_payment(order) is None


@pytest.mark.django_db
class TestStartOrderPayment:

    def test_returns_the_client_secret(self, stripe_intent):
        order = OrderFactory(budget=Decimal('80.00'))
        assert start_order_payment(order) == 'pi_test_123_secret'

    def test_records_a_payment_matching_what_stripe_is_charged(self, stripe_intent):
        order = OrderFactory(budget=Decimal('80.00'))
        start_order_payment(order)

        charged_cents = stripe_intent.call_args.kwargs['amount']
        payment = Payment.objects.get(order=order)

        # The guest and authenticated paths used to clamp differently, so the
        # recorded Payment could disagree with the actual charge.
        assert Decimal(charged_cents) == payment.amount * 100
        assert payment.status == 'pending'
        assert payment.stripe_payment_intent_id == 'pi_test_123'

    def test_one_off_orders_do_not_save_the_card(self, stripe_intent):
        order = OrderFactory(billing_mode='one_time', budget=Decimal('80.00'))
        start_order_payment(order)
        assert 'setup_future_usage' not in stripe_intent.call_args.kwargs

    def test_recurring_orders_save_the_card_for_later_deliveries(self, stripe_intent):
        order = OrderFactory(billing_mode='recurring', budget=Decimal('80.00'), frequency='monthly')
        start_order_payment(order)
        assert stripe_intent.call_args.kwargs['setup_future_usage'] == 'off_session'

    def test_the_order_is_identifiable_from_stripe_metadata(self, stripe_intent):
        order = OrderFactory(budget=Decimal('80.00'))
        start_order_payment(order)

        metadata = stripe_intent.call_args.kwargs['metadata']
        assert metadata['order_id'] == str(order.id)
        assert metadata['billing_mode'] == order.billing_mode

    def test_staff_are_charged_the_order_total_like_anyone_else(self, stripe_intent):
        """
        Staff used to be billed a $1 override. Because the charge was derived from
        order.user, and the checkout let an unverified email pick that user, naming
        a staff address bought any order for $1.
        """
        staff = UserFactory(is_staff=True, is_superuser=True)
        order = OrderFactory(user=staff, budget=Decimal('500.00'))
        start_order_payment(order)

        assert stripe_intent.call_args.kwargs['amount'] == 50000
        assert Payment.objects.get(order=order).amount == Decimal('500.00')

    def test_a_pending_intent_of_the_same_amount_is_reused(self, stripe_intent, mocker):
        mocker.patch(
            'payments.utils.checkout.reuse_or_cancel_pending_payment_intent',
            return_value='pi_existing_secret',
        )
        order = OrderFactory(budget=Decimal('80.00'))

        assert start_order_payment(order) == 'pi_existing_secret'
        stripe_intent.assert_not_called()
        assert not Payment.objects.filter(order=order).exists()
