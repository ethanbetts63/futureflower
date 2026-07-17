import pytest
from decimal import Decimal
from data_management.serializers.admin_user_detail_serializer import AdminUserDetailSerializer
from users.tests.factories.user_factory import UserFactory
from partners.tests.factories.partner_factory import PartnerFactory
from events.tests.factories.order_factory import OrderFactory

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
    # Budget drives the total: $100 is at the threshold, so no delivery fee is added.
    plan1 = OrderFactory(billing_mode='one_time', user=user, budget=Decimal('100.00'), discount_amount=Decimal('0'), tax_amount=Decimal('0'))
    plan2 = OrderFactory(billing_mode='recurring', user=user, budget=Decimal('50.00'), discount_amount=Decimal('0'), tax_amount=Decimal('0'))
    
    serializer = AdminUserDetailSerializer(user)
    data = serializer.data
    
    assert len(data['plans']) == 2
    
    # Verify plan details
    plan_types = {p['plan_type'] for p in data['plans']}
    assert 'one_time' in plan_types
    assert 'recurring' in plan_types
    
    amounts = {float(p['total_amount']) for p in data['plans']}
    assert 100.00 in amounts
    # $50 is under the threshold, so the $20 delivery fee is added on top.
    assert 70.00 in amounts
