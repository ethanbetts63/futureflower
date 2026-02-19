import pytest
from rest_framework.test import APIClient
from users.models import User
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestRegisterView:
    """
    Tests for POST /api/users/register/.
    Registration should immediately log the user in by setting HttpOnly cookies —
    tokens must not be exposed in the response body.
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

    def test_registration_returns_201(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert response.status_code == 201

    def test_registration_creates_user(self):
        self.client.post(self.url, self.valid_data, format='json')
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_registration_sets_access_token_cookie(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert 'access_token' in response.cookies

    def test_registration_access_token_cookie_is_httponly(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert response.cookies['access_token']['httponly']

    def test_registration_sets_refresh_token_cookie(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert 'refresh_token' in response.cookies

    def test_registration_refresh_token_cookie_is_httponly(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        assert response.cookies['refresh_token']['httponly']

    def test_registration_does_not_return_tokens_in_body(self):
        """
        Tokens must not appear in the JSON body — they belong exclusively
        in the HttpOnly cookies set by the server.
        """
        response = self.client.post(self.url, self.valid_data, format='json')
        assert 'access' not in response.data
        assert 'refresh' not in response.data

    def test_registration_returns_user_in_body(self):
        """
        The response body should include basic user info so the frontend
        can display it without needing a follow-up profile request.
        """
        response = self.client.post(self.url, self.valid_data, format='json')
        assert 'user' in response.data
        assert response.data['user']['email'] == 'newuser@example.com'
        assert response.data['user']['first_name'] == 'New'

    def test_registration_with_duplicate_email_returns_400(self):
        UserFactory(email='taken@example.com')
        data = {**self.valid_data, 'email': 'taken@example.com'}

        response = self.client.post(self.url, data, format='json')

        assert response.status_code == 400
        assert 'email' in response.data

    def test_registration_with_missing_fields_returns_400(self):
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 400
