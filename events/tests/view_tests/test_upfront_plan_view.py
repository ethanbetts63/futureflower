import pytest
from rest_framework.test import APIClient
from decimal import Decimal
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from users.tests.factories.user_factory import UserFactory
from events.utils.upfront_price_calc import forever_flower_upfront_price

@pytest.mark.django_db
class TestUpfrontPlanViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/events/upfront-plans/'

    def test_create_plan_calculates_price(self):
        data = {
            "budget": "100.00",
            "frequency": "quarterly",
            "years": 5,
            "recipient_first_name": "Test",
            "recipient_last_name": "User",
            "recipient_street_address": "123 Street",
            "recipient_suburb": "Suburb",
            "recipient_city": "City",
            "recipient_state": "State",
            "recipient_postcode": "1234",
            "recipient_country": "US"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 201
        
        plan_id = response.data['id']
        from events.models import UpfrontPlan
        plan = UpfrontPlan.objects.get(id=plan_id)
        
        expected_price, _ = forever_flower_upfront_price(100, "quarterly", 5)
        assert abs(plan.total_amount - Decimal(str(expected_price))) < Decimal('0.01')

    def test_partial_update_validates_price(self):
        plan = UpfrontPlanFactory(user=self.user, budget=100, frequency='annually', years=1)
        detail_url = f"{self.url}{plan.id}/"
        
        # Calculate what the server expects
        server_price, _ = forever_flower_upfront_price(150, "annually", 1)
        
        # Try with wrong price
        data = {
            "budget": "150.00",
            "frequency": "annually",
            "years": 1,
            "total_amount": str(server_price + 10) # Incorrect
        }
        response = self.client.patch(detail_url, data, format='json')
        assert response.status_code == 400
        assert "Price mismatch" in response.data['error']

        # Try with correct price
        data["total_amount"] = str(server_price)
        response = self.client.patch(detail_url, data, format='json')
        assert response.status_code == 200
        
    def test_get_latest_pending_plan(self):
        # Create an active plan
        UpfrontPlanFactory(user=self.user, status='active')
        # Create a pending plan
        pending = UpfrontPlanFactory(user=self.user, status='pending_payment')
        
        url = f"{self.url}get-latest-pending/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == pending.id

    def test_get_latest_pending_none(self):
        url = f"{self.url}get-latest-pending/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data is None

    def test_filter_exclude_single_delivery(self):
        # Single delivery plan (1 year, annually)
        UpfrontPlanFactory(user=self.user, years=1, frequency='annually')
        # Multi-year plan
        UpfrontPlanFactory(user=self.user, years=5, frequency='quarterly')
        
        # Default: returns all
        response = self.client.get(self.url)
        assert len(response.data) == 2
        
        # Filtered: exclude single delivery
        response = self.client.get(f"{self.url}?exclude_single_delivery=true")
        assert len(response.data) == 1
        assert response.data[0]['years'] == 5
