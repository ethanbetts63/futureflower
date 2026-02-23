import pytest
from rest_framework.test import APIClient
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminPlanListView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self):
        return '/api/data/admin/plans/'

    def test_returns_all_plans_by_default(self):
        UpfrontPlanFactory()
        SubscriptionPlanFactory()
        response = self.client.get(self._url())
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_filter_by_plan_type_upfront_only(self):
        upfront = UpfrontPlanFactory()
        SubscriptionPlanFactory()
        response = self.client.get(self._url(), {'plan_type': 'upfront'})
        ids = [p['id'] for p in response.data]
        assert upfront.pk in ids
        assert len(ids) == 1

    def test_filter_by_plan_type_subscription_only(self):
        UpfrontPlanFactory()
        sub = SubscriptionPlanFactory()
        response = self.client.get(self._url(), {'plan_type': 'subscription'})
        ids = [p['id'] for p in response.data]
        assert sub.pk in ids
        assert len(ids) == 1

    def test_filter_by_status(self):
        active = UpfrontPlanFactory(status='active')
        UpfrontPlanFactory(status='pending_payment')
        response = self.client.get(self._url(), {'status': 'active'})
        ids = [p['id'] for p in response.data]
        assert active.pk in ids
        assert len(ids) == 1

    def test_search_by_user_email(self):
        user = UserFactory(email='findme@example.com')
        plan = UpfrontPlanFactory(user=user)
        UpfrontPlanFactory()
        response = self.client.get(self._url(), {'search': 'findme'})
        ids = [p['id'] for p in response.data]
        assert plan.pk in ids

    def test_search_by_recipient_last_name(self):
        plan = UpfrontPlanFactory(recipient_last_name='UniqueRecipient')
        UpfrontPlanFactory(recipient_last_name='Other')
        response = self.client.get(self._url(), {'search': 'UniqueRecipient'})
        ids = [p['id'] for p in response.data]
        assert plan.pk in ids

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)
        response = client.get(self._url())
        assert response.status_code == 403

    def test_empty_list_when_no_plans(self):
        response = self.client.get(self._url())
        assert response.status_code == 200
        assert response.data == []
