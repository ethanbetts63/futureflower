import pytest
from decimal import Decimal
from rest_framework.test import APIClient
from partners.tests.factories.discount_code_factory import DiscountCodeFactory

@pytest.mark.django_db
class TestValidateDiscountCodeView:
    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/partners/validate-discount-code/'

    def test_validate_valid_code(self):
        dc = DiscountCodeFactory(code="SAVE5", discount_amount=Decimal('5.00'), is_active=True)
        response = self.client.post(self.url, {"code": "SAVE5"}, format='json')
        assert response.status_code == 200
        assert Decimal(response.data['discount_amount']) == Decimal('5.00')

    def test_validate_case_insensitive(self):
        dc = DiscountCodeFactory(code="SAVE5", is_active=True)
        response = self.client.post(self.url, {"code": "save5"}, format='json')
        assert response.status_code == 200

    def test_validate_inactive_code(self):
        dc = DiscountCodeFactory(code="EXPIRED", is_active=False)
        response = self.client.post(self.url, {"code": "EXPIRED"}, format='json')
        assert response.status_code == 400
        assert "no longer active" in response.data['code'][0].lower()

    def test_validate_non_existent_code(self):
        response = self.client.post(self.url, {"code": "NOSUCHCODE"}, format='json')
        assert response.status_code == 400

    def test_validate_already_customer_fails(self):
        from users.tests.factories.user_factory import UserFactory
        from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
        from payments.tests.factories.payment_factory import PaymentFactory
        
        user = UserFactory()
        self.client.force_authenticate(user=user)
        plan = UpfrontPlanFactory(user=user)
        PaymentFactory(user=user, order=plan.orderbase_ptr, status='succeeded')
        
        dc = DiscountCodeFactory(code="NEWBIE")
        response = self.client.post(self.url, {"code": "NEWBIE"}, format='json')
        
        assert response.status_code == 400
        assert "only available for new customers" in response.data['code'][0].lower()
