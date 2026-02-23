import pytest
from rest_framework.test import APIClient
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminPlanDetailView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self, plan_type, pk):
        return f'/api/data/admin/plans/{plan_type}/{pk}/'

    def test_returns_upfront_plan(self):
        plan = UpfrontPlanFactory()
        response = self.client.get(self._url('upfront', plan.pk))
        assert response.status_code == 200
        assert response.data['id'] == plan.pk

    def test_returns_subscription_plan(self):
        plan = SubscriptionPlanFactory()
        response = self.client.get(self._url('subscription', plan.pk))
        assert response.status_code == 200
        assert response.data['id'] == plan.pk

    def test_400_for_invalid_plan_type(self):
        plan = UpfrontPlanFactory()
        response = self.client.get(self._url('invalid', plan.pk))
        assert response.status_code == 400

    def test_404_for_nonexistent_upfront_plan(self):
        response = self.client.get(self._url('upfront', 99999))
        assert response.status_code == 404

    def test_404_for_nonexistent_subscription_plan(self):
        response = self.client.get(self._url('subscription', 99999))
        assert response.status_code == 404

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)
        plan = UpfrontPlanFactory()
        response = client.get(self._url('upfront', plan.pk))
        assert response.status_code == 403

    def test_requires_authentication(self):
        client = APIClient()
        plan = UpfrontPlanFactory()
        response = client.get(self._url('upfront', plan.pk))
        assert response.status_code == 401
