import pytest
from rest_framework.test import APIClient
import stripe
from decimal import Decimal
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from payments.models import Payment

@pytest.mark.django_db
class TestCreatePaymentIntentView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/payments/create-payment-intent/'

    def test_create_payment_intent_upfront_plan_new_success(self, mocker):
        plan = UpfrontPlanFactory(user=self.user, subtotal=Decimal('100.00'))
        
        mock_pi = mocker.MagicMock()
        mock_pi.id = 'pi_123'
        mock_pi.client_secret = 'cs_123'
        # mock amount needs to match what we expect
        mock_pi.amount = 10000 
        mocker.patch.object(stripe.PaymentIntent, 'create', return_value=mock_pi)
        mocker.patch.object(stripe.Customer, 'create', return_value=mocker.MagicMock(id='cus_123'))

        data = {
            'item_type': 'UPFRONT_PLAN_NEW',
            'details': {
                'upfront_plan_id': plan.id
            }
        }
        response = self.client.post(self.url, data, format='json')

        assert response.status_code == 200
        assert response.data['clientSecret'] == 'cs_123'
        
        payment = Payment.objects.get(stripe_payment_intent_id='pi_123')
        assert payment.amount == Decimal('100.00')
        assert payment.order == plan.orderbase_ptr

    def test_create_payment_intent_with_discount_success(self, mocker):
        # Create plan and apply discount beforehand
        dc = DiscountCodeFactory(code="SAVE10", discount_amount=Decimal('10.00'), is_active=True)
        plan = UpfrontPlanFactory(
            user=self.user, 
            subtotal=Decimal('100.00'),
            discount_code=dc,
            discount_amount=Decimal('10.00')
        )
        plan.save() # Ensures total_amount is calculated as 90.00
        
        mocker.patch.object(stripe.PaymentIntent, 'create', return_value=mocker.MagicMock(id='pi_123', client_secret='cs_123', amount=9000))    
        mocker.patch.object(stripe.Customer, 'create', return_value=mocker.MagicMock(id='cus_123'))

        data = {
            'item_type': 'UPFRONT_PLAN_NEW',
            'details': {
                'upfront_plan_id': plan.id,
                # discount_code in details is ignored by view logic but harmless
                'discount_code': 'SAVE10' 
            }
        }
        response = self.client.post(self.url, data, format='json')

        assert response.status_code == 200
        payment = Payment.objects.get(stripe_payment_intent_id='pi_123')
        assert payment.amount == Decimal('90.00')

    def test_create_payment_intent_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 401

    def test_missing_parameters(self):
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 400

    def test_plan_not_found(self):
        data = {
            'item_type': 'UPFRONT_PLAN_NEW',
            'details': {'upfront_plan_id': 999}
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 404
