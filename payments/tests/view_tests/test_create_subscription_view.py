import pytest
from rest_framework.test import APIClient
import stripe
from decimal import Decimal
from datetime import date, timedelta
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from django.conf import settings

@pytest.mark.django_db
class TestCreateSubscriptionView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/payments/create-subscription/'

    @pytest.mark.parametrize("frequency", ['weekly', 'monthly', 'annually'])
    def test_create_subscription_success(self, mocker, frequency):
        # We now expect a PaymentIntent for the first delivery amount
        start_date = date.today() + timedelta(days=2) # Lead time doesn't matter for initial payment
        plan = SubscriptionPlanFactory(
            user=self.user, 
            total_amount=Decimal('100.00'), 
            start_date=start_date,
            frequency=frequency
        )
        
        mocker.patch.object(stripe.Customer, 'create', return_value=mocker.MagicMock(id='cus_123'))
        
        mock_pi = mocker.MagicMock()
        mock_pi.id = 'pi_123'
        mock_pi.client_secret = 'pi_secret_123'
        mock_pi.status = 'requires_payment_method'
        mocker.patch.object(stripe.PaymentIntent, 'create', return_value=mock_pi)

        data = {'subscription_plan_id': plan.id}
        response = self.client.post(self.url, data, format='json')

        assert response.status_code == 200
        assert response.data['clientSecret'] == 'pi_secret_123'
        
        # In the new flow, Payment is created, but plan status remains 'pending_payment'
        # until the webhook fulfills it.
        from payments.models import Payment
        assert Payment.objects.filter(order=plan.orderbase_ptr, stripe_payment_intent_id='pi_123').exists()

    def test_create_subscription_invalid_plan_fails(self):
        # Missing total_amount
        plan = SubscriptionPlanFactory(user=self.user, total_amount=None)
        
        data = {'subscription_plan_id': plan.id}
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == 400
        assert "missing price" in response.data['error'].lower()
