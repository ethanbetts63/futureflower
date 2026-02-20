import pytest
from decimal import Decimal
from data_management.serializers.admin_user_detail_serializer import AdminUserDetailSerializer
from users.tests.factories.user_factory import UserFactory
from partners.tests.factories.partner_factory import PartnerFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory

@pytest.mark.django_db
def test_admin_user_detail_serializer_basic():
    """
    Test basic serialization of user fields.
    """
    user = UserFactory()
    serializer = AdminUserDetailSerializer(user)
    data = serializer.data
    assert data['email'] == user.email
    assert data['is_partner'] is False
    assert data['referred_by'] is None
    assert data['plans'] == []

@pytest.mark.django_db
def test_admin_user_detail_serializer_is_partner():
    """
    Test that is_partner returns True if user has a partner profile.
    """
    partner = PartnerFactory()
    user = partner.user
    
    serializer = AdminUserDetailSerializer(user)
    data = serializer.data
    assert data['is_partner'] is True

@pytest.mark.django_db
def test_admin_user_detail_serializer_referred_by():
    """
    Test that referred_by returns the partner's business name.
    """
    partner = PartnerFactory(business_name="Test Partner")
    user = UserFactory(referred_by_partner=partner)
    
    serializer = AdminUserDetailSerializer(user)
    data = serializer.data
    assert data['referred_by'] == "Test Partner"

@pytest.mark.django_db
def test_admin_user_detail_serializer_plans():
    """
    Test that plans (both upfront and subscription) are correctly serialized and included.
    """
    user = UserFactory()
    plan1 = UpfrontPlanFactory(user=user, subtotal=Decimal('100.00'), discount_amount=Decimal('0'), tax_amount=Decimal('0'))
    plan2 = SubscriptionPlanFactory(user=user, subtotal=Decimal('50.00'), discount_amount=Decimal('0'), tax_amount=Decimal('0'))
    
    serializer = AdminUserDetailSerializer(user)
    data = serializer.data
    
    assert len(data['plans']) == 2
    
    # Verify plan details
    plan_types = {p['plan_type'] for p in data['plans']}
    assert 'upfront' in plan_types
    assert 'subscription' in plan_types
    
    amounts = {float(p['total_amount']) for p in data['plans']}
    assert 100.00 in amounts
    assert 50.00 in amounts
