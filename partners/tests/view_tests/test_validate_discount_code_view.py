import pytest
from decimal import Decimal
from rest_framework.test import APIClient
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from partners.models import DiscountCode

@pytest.mark.django_db
class TestValidateDiscountCodeView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/partners/validate-discount-code/'
        # Create a plan for the user to apply discount to
        self.plan = UpfrontPlanFactory(user=self.user, subtotal=100)

    def test_validate_valid_code(self):
        dc = DiscountCodeFactory(code="SAVE5", discount_amount=Decimal('5.00'), is_active=True)
        data = {
            "code": "SAVE5",
            "plan_id": self.plan.id,
            "plan_type": "upfront"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 200
        assert Decimal(response.data['discount_amount']) == Decimal('5.00')
        
        self.plan.refresh_from_db()
        assert self.plan.discount_code == dc
        assert self.plan.discount_amount == Decimal('5.00')

    def test_validate_case_insensitive(self):
        dc = DiscountCodeFactory(code="SAVE5", discount_amount=Decimal('5.00'), is_active=True)
        data = {
            "code": "save5",
            "plan_id": self.plan.id,
            "plan_type": "upfront"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 200
        assert Decimal(response.data['discount_amount']) == Decimal('5.00')

    def test_validate_inactive_code(self):
        dc = DiscountCodeFactory(code="EXPIRED", is_active=False)
        data = {
            "code": "EXPIRED",
            "plan_id": self.plan.id,
            "plan_type": "upfront"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 400

    def test_validate_non_existent_code(self):
        data = {
            "code": "NOSUCHCODE",
            "plan_id": self.plan.id,
            "plan_type": "upfront"
        }
        response = self.client.post(self.url, data, format='json')
        assert response.status_code == 400

    def test_validate_already_customer_fails(self):
        # Mark a payment as succeeded to simulate existing customer
        from payments.tests.factories.payment_factory import PaymentFactory
        PaymentFactory(user=self.user, order=self.plan.orderbase_ptr, status='succeeded')
        
        dc = DiscountCodeFactory(code="NEWBIE", is_active=True)
        data = {
            "code": "NEWBIE",
            "plan_id": self.plan.id,
            "plan_type": "upfront"
        }
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == 400
