import pytest
from rest_framework.test import APIClient
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.models import UpfrontPlan
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestGetOrCreateInactivePlanView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def _url(self):
        return '/api/events/upfront-plans/get-or-create-pending/'

    def test_returns_existing_pending_plan(self):
        existing = UpfrontPlanFactory(user=self.user, status='pending_payment')
        response = self.client.get(self._url())
        assert response.status_code == 200
        assert response.data['id'] == existing.pk

    def test_creates_new_plan_when_none_exists(self):
        initial_count = UpfrontPlan.objects.filter(user=self.user).count()
        response = self.client.get(self._url())
        assert response.status_code == 201
        assert UpfrontPlan.objects.filter(user=self.user).count() == initial_count + 1

    def test_created_plan_belongs_to_user(self):
        response = self.client.get(self._url())
        plan_id = response.data['id']
        plan = UpfrontPlan.objects.get(pk=plan_id)
        assert plan.user == self.user

    def test_single_delivery_mode_returns_single_delivery_plan(self):
        single = UpfrontPlanFactory(user=self.user, status='pending_payment', years=1, frequency='annually')
        response = self.client.get(self._url(), {'mode': 'single-delivery'})
        assert response.status_code == 200
        assert response.data['id'] == single.pk

    def test_regular_mode_excludes_single_delivery_plans(self):
        UpfrontPlanFactory(user=self.user, status='pending_payment', years=1, frequency='annually')
        response = self.client.get(self._url())
        assert response.status_code == 201

    def test_single_delivery_mode_creates_plan_with_correct_fields(self):
        response = self.client.get(self._url(), {'mode': 'single-delivery'})
        assert response.status_code == 201
        plan = UpfrontPlan.objects.get(pk=response.data['id'])
        assert plan.years == 1
        assert plan.frequency == 'annually'

    def test_requires_authentication(self):
        client = APIClient()
        response = client.get(self._url())
        assert response.status_code == 401

    def test_does_not_return_other_users_plan(self):
        other_user = UserFactory()
        UpfrontPlanFactory(user=other_user, status='pending_payment')
        response = self.client.get(self._url())
        assert response.status_code == 201

    def test_does_not_return_active_plan(self):
        UpfrontPlanFactory(user=self.user, status='active')
        response = self.client.get(self._url())
        # No pending plan exists → creates a new one
        assert response.status_code == 201
