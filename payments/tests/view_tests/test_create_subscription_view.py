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
        # Set start_date far enough in the future to avoid past trial_end
        start_date = date.today() + timedelta(days=20)
        plan = SubscriptionPlanFactory(
            user=self.user, 
            total_amount=Decimal('100.00'), 
            start_date=start_date,
            frequency=frequency
        )
        
        mocker.patch.object(stripe.Customer, 'create', return_value=mocker.MagicMock(id='cus_123'))
        
        mock_sub = mocker.MagicMock()
        mock_sub.id = 'sub_123'
        mock_sub.pending_setup_intent = 'si_123'
        mocker.patch.object(stripe.Subscription, 'create', return_value=mock_sub)
        
        mock_si = mocker.MagicMock()
        mock_si.id = 'si_123'
        mock_si.client_secret = 'cs_123'
        mocker.patch.object(stripe.SetupIntent, 'retrieve', return_value=mock_si)
        mocker.patch.object(stripe.SetupIntent, 'modify')

        data = {'subscription_plan_id': plan.id}
        response = self.client.post(self.url, data, format='json')

        assert response.status_code == 200
        assert response.data['clientSecret'] == 'cs_123'
        
        plan.refresh_from_db()
        assert plan.stripe_subscription_id == 'sub_123'

    def test_create_subscription_past_start_date_fails(self):
        # Start date today, lead days 6 -> trial_end is in the past
        start_date = date.today()
        plan = SubscriptionPlanFactory(user=self.user, start_date=start_date)
        
        data = {'subscription_plan_id': plan.id}
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == 400
        assert "billing is in the past" in response.data['error']
