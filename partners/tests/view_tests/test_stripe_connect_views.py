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

    # --- Onboard view ---

    def test_onboard_view_success(self, mocker):
        partner = PartnerFactory(user=self.user)
        mock_acc = mocker.patch('stripe.Account.create')
        mock_acc.return_value = mocker.MagicMock(id='acct_123')

        mock_session = mocker.patch('stripe.AccountSession.create')
        mock_session.return_value = mocker.MagicMock(client_secret='secret_123')

        response = self.client.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code == 200
        assert response.data['client_secret'] == 'secret_123'

        partner.refresh_from_db()
        assert partner.stripe_connect_account_id == 'acct_123'

    def test_onboard_view_uses_existing_account_id(self, mocker):
        """If partner already has a stripe_connect_account_id, no new account is created."""
        partner = PartnerFactory(user=self.user, stripe_connect_account_id='acct_existing')
        mock_acc = mocker.patch('stripe.Account.create')
        mock_session = mocker.patch('stripe.AccountSession.create')
        mock_session.return_value = mocker.MagicMock(client_secret='secret_xyz')

        response = self.client.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code == 200
        assert response.data['client_secret'] == 'secret_xyz'
        mock_acc.assert_not_called()

        partner.refresh_from_db()
        assert partner.stripe_connect_account_id == 'acct_existing'

    def test_onboard_view_requires_auth(self):
        unauthenticated = APIClient()
        response = unauthenticated.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code in (401, 403)

    def test_onboard_view_no_partner_returns_404(self, mocker):
        """User with no Partner record gets a 404."""
        mocker.patch('stripe.Account.create', return_value=mocker.MagicMock(id='acct_new'))
        mocker.patch('stripe.AccountSession.create', return_value=mocker.MagicMock(client_secret='s'))
        # self.user has no partner profile
        response = self.client.post('/api/partners/stripe-connect/onboard/')
        assert response.status_code == 404

    # --- Status view ---

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

    def test_status_view_incomplete_when_payouts_disabled(self, mocker):
        partner = PartnerFactory(
            user=self.user,
            stripe_connect_account_id='acct_123',
            stripe_connect_onboarding_complete=False,
        )
        mock_retrieve = mocker.patch('stripe.Account.retrieve')
        mock_retrieve.return_value = mocker.MagicMock(
            charges_enabled=False,
            payouts_enabled=False,
        )

        response = self.client.get('/api/partners/stripe-connect/status/')
        assert response.status_code == 200
        assert response.data['onboarding_complete'] is False

        partner.refresh_from_db()
        assert partner.stripe_connect_onboarding_complete is False

    def test_status_view_no_stripe_account_returns_400(self):
        PartnerFactory(user=self.user, stripe_connect_account_id=None)
        response = self.client.get('/api/partners/stripe-connect/status/')
        assert response.status_code == 400

    def test_status_view_requires_auth(self):
        unauthenticated = APIClient()
        response = unauthenticated.get('/api/partners/stripe-connect/status/')
        assert response.status_code in (401, 403)
