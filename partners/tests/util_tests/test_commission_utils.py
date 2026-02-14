import pytest
from decimal import Decimal
from partners.utils.commission_utils import process_referral_commission
from partners.models import Commission
from partners.tests.factories.partner_factory import PartnerFactory
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from payments.tests.factories.payment_factory import PaymentFactory

@pytest.mark.django_db
class TestCommissionUtils:
    def test_process_referral_commission_success(self):
        partner = PartnerFactory()
        user = UserFactory(referred_by_partner=partner)
        plan = UpfrontPlanFactory(user=user, budget=100)
        payment = PaymentFactory(user=user, order=plan.orderbase_ptr, status='succeeded')
        
        # Payment count is 1
        process_referral_commission(payment)
        
        commission = Commission.objects.get(payment=payment)
        assert commission.partner == partner
        assert commission.amount == Decimal('5.00') # 5% of 100
        assert commission.commission_type == 'referral'

    def test_process_referral_commission_no_partner(self):
        user = UserFactory(referred_by_partner=None)
        plan = UpfrontPlanFactory(user=user, budget=100)
        payment = PaymentFactory(user=user, order=plan.orderbase_ptr, status='succeeded')
        
        process_referral_commission(payment)
        assert Commission.objects.count() == 0

    def test_process_referral_commission_limit_exceeded(self):
        partner = PartnerFactory()
        user = UserFactory(referred_by_partner=partner)
        plan = UpfrontPlanFactory(user=user, budget=100)
        
        # Create 3 previous succeeded payments
        for _ in range(3):
            PaymentFactory(user=user, order=plan.orderbase_ptr, status='succeeded')
            
        # 4th succeeded payment
        payment = PaymentFactory(user=user, order=plan.orderbase_ptr, status='succeeded')
        
        process_referral_commission(payment)
        # Succeeded count is now 4, so it should NOT create a commission
        assert Commission.objects.count() == 0
