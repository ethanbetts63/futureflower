import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user():
    return User.objects.create_superuser('admin@example.com', 'password')

@pytest.fixture
def regular_user():
    return User.objects.create_user('user@example.com', 'password')

def test_manual_notification_history_unauthorized(api_client, regular_user):
    """
    Test that a non-admin user cannot access the view.
    """
    api_client.force_authenticate(user=regular_user)
    url = reverse('data_management:manual-notification-history')
    response = api_client.get(url)
    assert response.status_code == 403

