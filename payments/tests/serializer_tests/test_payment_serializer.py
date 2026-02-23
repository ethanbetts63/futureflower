import pytest
from decimal import Decimal
from payments.serializers.payment_serializer import PaymentSerializer
from payments.tests.factories.payment_factory import PaymentFactory


@pytest.mark.django_db
class TestPaymentSerializer:

    def test_serializes_all_expected_fields(self):
        payment = PaymentFactory(amount=Decimal('99.99'), status='succeeded')
        data = PaymentSerializer(payment).data
        assert 'id' in data
        assert 'amount' in data
        assert 'status' in data
        assert 'created_at' in data
        assert 'stripe_payment_intent_id' in data

    def test_amount_serializes_correctly(self):
        payment = PaymentFactory(amount=Decimal('99.99'), status='succeeded')
        data = PaymentSerializer(payment).data
        assert Decimal(data['amount']) == Decimal('99.99')

    def test_status_serializes_correctly(self):
        payment = PaymentFactory(status='pending')
        data = PaymentSerializer(payment).data
        assert data['status'] == 'pending'

    def test_stripe_payment_intent_id_included(self):
        payment = PaymentFactory(stripe_payment_intent_id='pi_test_abc123')
        data = PaymentSerializer(payment).data
        assert data['stripe_payment_intent_id'] == 'pi_test_abc123'

    def test_id_matches_instance(self):
        payment = PaymentFactory()
        data = PaymentSerializer(payment).data
        assert data['id'] == payment.pk

    def test_created_at_is_present(self):
        payment = PaymentFactory()
        data = PaymentSerializer(payment).data
        assert data['created_at'] is not None
