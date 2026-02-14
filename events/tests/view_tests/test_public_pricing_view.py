import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestPublicPricingView:
    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/events/calculate-price/'

    def test_public_price_calculation(self):
        data = {
            "budget": 100,
            "frequency": "monthly",
            "years": 3
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 200
        assert "upfront_price" in response.data
        assert "breakdown" in response.data
        assert response.data["upfront_price"] > 0

    def test_public_price_calculation_invalid_input(self):
        data = {
            "budget": "invalid",
            "frequency": "monthly",
            "years": 3
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 400
