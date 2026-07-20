import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestDeleteUserView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(
            is_active=True,
            first_name="Test",
            last_name="User",
            email="test@example.com",
        )
        self.url = '/api/users/delete/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.delete(self.url)
        assert response.status_code == 401

    def test_delete_deactivates_and_marks_deleted_at(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)

        assert response.status_code == 204

        self.user.refresh_from_db()
        assert self.user.is_active is False
        assert self.user.deleted_at is not None
