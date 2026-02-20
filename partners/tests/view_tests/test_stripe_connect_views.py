import pytest
from rest_framework.test import APIClient
from partners.tests.factories.partner_factory import PartnerFactory
from users.tests.factories.user_factory import UserFactory
import stripe

@pytest.mark.django_db
class TestStripeConnectViews:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_onboard_view_success(self, mocker):
        partner = PartnerFactory(user=self.user)
        # Mock account creation (if needed)
        mock_acc = mocker.patch('stripe.Account.create')
        mock_acc.return_value = mocker.MagicMock(id='acct_123')
        
        # Mock AccountSession creation (this is what's used for embedded onboarding)
        mock_session = mocker.patch('stripe.AccountSession.create')
        mock_session.return_value = mocker.MagicMock(client_secret='secret_123')
        
        response = self.client.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code == 200
        assert response.data['client_secret'] == 'secret_123'
        
        partner.refresh_from_db()
        assert partner.stripe_connect_account_id == 'acct_123'

    def test_status_view_success(self, mocker):
        partner = PartnerFactory(user=self.user, stripe_connect_account_id='acct_123')
        mock_retrieve = mocker.patch('stripe.Account.retrieve')
        mock_retrieve.return_value = mocker.MagicMock(
            charges_enabled=True,
            payouts_enabled=True
        )
        
        response = self.client.get('/api/partners/stripe-connect/status/')
        assert response.status_code == 200
        assert response.data['onboarding_complete'] is True
        
        partner.refresh_from_db()
        assert partner.stripe_connect_onboarding_complete is True
