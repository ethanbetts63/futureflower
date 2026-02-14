import pytest
from rest_framework.test import APIClient
from partners.tests.factories.partner_factory import PartnerFactory
from partners.tests.factories.commission_factory import CommissionFactory
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestPartnerDashboardView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/partners/dashboard/'

    def test_dashboard_success(self):
        partner = PartnerFactory(user=self.user, business_name="My Flower Shop")
        DiscountCodeFactory(partner=partner, code="MYSHOP5")
        CommissionFactory(partner=partner, amount=Decimal('10.00'), status='pending')
        CommissionFactory(partner=partner, amount=Decimal('20.00'), status='paid')
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert response.data['business_name'] == "My Flower Shop"
        assert response.data['discount_code']['code'] == "MYSHOP5"
        assert Decimal(response.data['commission_summary']['total_earned']) == Decimal('30.00')

    def test_dashboard_not_partner_fails(self):
        # User is authenticated but has no Partner profile
        response = self.client.get(self.url)
        assert response.status_code == 404
        assert "not registered as a partner" in response.data['error']

from decimal import Decimal
