import pytest
from rest_framework.test import APIClient
from partners.tests.factories.partner_factory import PartnerFactory
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestStripeConnectViews:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_onboard_view_success(self, mocker):
        partner = PartnerFactory(user=self.user)
        mock_acc = mocker.patch('stripe.Account.create')
        mock_acc.return_value = mocker.MagicMock(id='acct_123')
        mock_link = mocker.patch('stripe.AccountLink.create')
        mock_link.return_value = mocker.MagicMock(url='https://stripe.com/onboard')
        
        response = self.client.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code == 200
        assert response.data['onboarding_url'] == 'https://stripe.com/onboard'
        
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
