import pytest
from rest_framework.test import APIClient
from decimal import Decimal
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestSubscriptionPlanViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/subscription-plans/'

    def test_get_queryset_filters_by_user(self):
        SubscriptionPlanFactory(user=self.user)
        SubscriptionPlanFactory(user=UserFactory()) # Other user
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_get_or_create_pending(self):
        url = f"{self.url}get-or-create-pending/"
        
        # First call creates
        response = self.client.get(url)
        assert response.status_code == 201
        plan_id = response.data['id']
        
        # Second call retrieves
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == plan_id

    def test_calculate_price(self):
        plan = SubscriptionPlanFactory(user=self.user)
        url = f"{self.url}{plan.id}/calculate-price/"
        
        # 100 + max(5, 15) = 115
        response = self.client.post(url, {"budget": "100.00"}, format='json')
        assert response.status_code == 200
        assert Decimal(response.data['price_per_delivery']) == Decimal('115.00')

    def test_calculate_price_invalid(self):
        plan = SubscriptionPlanFactory(user=self.user)
        url = f"{self.url}{plan.id}/calculate-price/"
        
        response = self.client.post(url, {"budget": "invalid"}, format='json')
        assert response.status_code == 400
