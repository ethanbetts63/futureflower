import pytest
from rest_framework.test import APIClient
from users.models import User


@pytest.mark.django_db
class TestRegisterView:
    """
    Self-service registration is retired: customers order as guests and manage
    their orders through the private link emailed to them, and staff/partner
    accounts are provisioned rather than self-registered. The endpoint is kept
    only so old clients get a clear 410 rather than a 404.
    """

    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/users/register/'
        self.valid_data = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123',
            'first_name': 'New',
            'last_name': 'User',
        }

    def test_registration_is_gone(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert response.status_code == 410

    def test_registration_creates_no_user(self):
        self.client.post(self.url, self.valid_data, format='json')
        assert not User.objects.filter(email='newuser@example.com').exists()

    def test_registration_sets_no_auth_cookies(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert 'access_token' not in response.cookies
        assert 'refresh_token' not in response.cookies
