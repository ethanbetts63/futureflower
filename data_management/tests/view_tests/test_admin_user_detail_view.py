import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminUserDetailView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self, pk):
        return f'/api/data/admin/users/{pk}/'

    def test_returns_user_data(self):
        user = UserFactory(email='target@example.com')
        response = self.client.get(self._url(user.pk))
        assert response.status_code == 200
        assert response.data['email'] == 'target@example.com'

    def test_returns_404_for_nonexistent_user(self):
        response = self.client.get(self._url(99999))
        assert response.status_code == 404

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        target = UserFactory()
        client = APIClient()
        client.force_authenticate(user=non_admin)
        response = client.get(self._url(target.pk))
        assert response.status_code == 403

    def test_requires_authentication(self):
        client = APIClient()
        user = UserFactory()
        response = client.get(self._url(user.pk))
        assert response.status_code == 401

    def test_response_includes_id_and_email(self):
        user = UserFactory()
        response = self.client.get(self._url(user.pk))
        assert 'id' in response.data
        assert 'email' in response.data
