# users/tests/view_tests/test_password_reset_confirm_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

@pytest.mark.django_db
class TestPasswordResetConfirmView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()

    def test_password_reset_success(self):
        self.user.refresh_from_db()
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        url = f'/api/users/password-reset/confirm/{uidb64}/{token}/'

        data = {
            'password': 'new_strong_password123',
            'password_confirm': 'new_strong_password123'
        }
        response = self.client.post(url, data, format='json')

        assert response.status_code == 200
        assert "reset successfully" in response.data['detail']
        
        self.user.refresh_from_db()
        assert self.user.check_password('new_strong_password123')

    def test_password_reset_invalid_token(self):
        self.user.refresh_from_db()
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        invalid_url = f'/api/users/password-reset/confirm/{uidb64}/invalid-token/'
        data = {
            'password': 'new_strong_password123',
            'password_confirm': 'new_strong_password123'
        }
        response = self.client.post(invalid_url, data, format='json')

        assert response.status_code == 400
        assert "invalid or has expired" in response.data['detail']

    def test_password_reset_invalid_uid(self):
        self.user.refresh_from_db()
        token = default_token_generator.make_token(self.user)
        invalid_url = f'/api/users/password-reset/confirm/invalid-uid/{token}/'
        data = {
            'password': 'new_strong_password123',
            'password_confirm': 'new_strong_password123'
        }
        response = self.client.post(invalid_url, data, format='json')

        assert response.status_code == 400
        assert "invalid or has expired" in response.data['detail']

    def test_password_reset_mismatched_passwords(self):
        self.user.refresh_from_db()
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        url = f'/api/users/password-reset/confirm/{uidb64}/{token}/'

        data = {
            'password': 'new_strong_password123',
            'password_confirm': 'mismatched_password'
        }
        response = self.client.post(url, data, format='json')

        assert response.status_code == 400
        assert 'password_confirm' in response.data

    def test_password_reset_password_too_short(self):
        self.user.refresh_from_db()
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        url = f'/api/users/password-reset/confirm/{uidb64}/{token}/'

        data = {
            'password': 'short',
            'password_confirm': 'short'
        }
        response = self.client.post(url, data, format='json')

        assert response.status_code == 400
        assert 'password' in response.data
