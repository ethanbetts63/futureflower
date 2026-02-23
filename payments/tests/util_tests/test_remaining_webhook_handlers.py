import pytest
from payments.utils.webhook_handlers import (
    handle_payment_intent_failed,
    handle_setup_intent_succeeded,
    handle_setup_intent_failed,
)
from payments.tests.factories.payment_factory import PaymentFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory


@pytest.mark.django_db
class TestHandlePaymentIntentFailed:

    def test_marks_payment_as_failed(self):
        payment = PaymentFactory(stripe_payment_intent_id='pi_fail_1', status='pending')

        handle_payment_intent_failed({'id': 'pi_fail_1'})

        payment.refresh_from_db()
        assert payment.status == 'failed'

    def test_unknown_payment_intent_does_not_raise(self):
        handle_payment_intent_failed({'id': 'pi_nonexistent'})

    def test_already_failed_payment_stays_failed(self):
        payment = PaymentFactory(stripe_payment_intent_id='pi_fail_2', status='failed')
        handle_payment_intent_failed({'id': 'pi_fail_2'})
        payment.refresh_from_db()
        assert payment.status == 'failed'

    def test_succeeded_payment_gets_marked_failed(self):
        payment = PaymentFactory(stripe_payment_intent_id='pi_fail_3', status='succeeded')
        handle_payment_intent_failed({'id': 'pi_fail_3'})
        payment.refresh_from_db()
        assert payment.status == 'failed'


@pytest.mark.django_db
class TestHandleSetupIntentSucceeded:

    def test_activates_pending_subscription_plan(self):
        plan = SubscriptionPlanFactory(status='pending_payment')
        setup_intent = {'metadata': {'subscription_plan_id': str(plan.pk)}}

        handle_setup_intent_succeeded(setup_intent)

        plan.refresh_from_db()
        assert plan.status == 'active'

    def test_already_active_plan_not_changed(self):
        plan = SubscriptionPlanFactory(status='active')
        setup_intent = {'metadata': {'subscription_plan_id': str(plan.pk)}}

        handle_setup_intent_succeeded(setup_intent)

        plan.refresh_from_db()
        assert plan.status == 'active'

    def test_missing_plan_id_does_not_raise(self):
        handle_setup_intent_succeeded({'metadata': {}})

    def test_nonexistent_plan_id_does_not_raise(self):
        handle_setup_intent_succeeded({'metadata': {'subscription_plan_id': '99999'}})

    def test_setup_intent_without_metadata_does_not_raise(self):
        handle_setup_intent_succeeded({})

    def test_string_plan_id_works(self):
        plan = SubscriptionPlanFactory(status='pending_payment')
        handle_setup_intent_succeeded({'metadata': {'subscription_plan_id': str(plan.pk)}})
        plan.refresh_from_db()
        assert plan.status == 'active'


class TestHandleSetupIntentFailed:

    def test_does_not_raise_with_customer_id(self):
        handle_setup_intent_failed({'customer': 'cus_test123'})

    def test_does_not_raise_without_customer(self):
        handle_setup_intent_failed({})

    def test_does_not_raise_with_error_details(self):
        handle_setup_intent_failed({
            'customer': 'cus_test',
            'last_setup_error': {'message': 'Card declined'}
        })
