import pytest
from payments.utils.webhook_handlers import handle_payment_intent_failed
from payments.tests.factories.payment_factory import PaymentFactory


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
