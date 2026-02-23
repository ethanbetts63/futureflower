import pytest
from decimal import Decimal
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from partners.serializers.validate_discount_code_serializer import ValidateDiscountCodeSerializer
from partners.tests.factories.partner_factory import PartnerFactory
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from payments.tests.factories.payment_factory import PaymentFactory
from users.tests.factories.user_factory import UserFactory


def make_request(user):
    factory = APIRequestFactory()
    req = factory.get('/')
    drf_req = Request(req)
    drf_req.user = user
    return drf_req


@pytest.mark.django_db
class TestValidateDiscountCodeSerializer:

    def test_valid_code_passes_validation(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert serializer.is_valid(), serializer.errors

    def test_nonexistent_code_fails(self):
        user = UserFactory()
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': 'DOESNOTEXIST', 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert not serializer.is_valid()
        assert 'code' in serializer.errors

    def test_inactive_partner_code_fails(self):
        user = UserFactory()
        partner = PartnerFactory(status='pending')
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert not serializer.is_valid()

    def test_own_code_fails(self):
        partner = PartnerFactory(status='active')
        user = partner.user
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert not serializer.is_valid()

    def test_existing_customer_code_fails(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        PaymentFactory(user=user, status='succeeded')
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert not serializer.is_valid()

    def test_empty_code_passes_validation(self):
        user = UserFactory()
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': '', 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert serializer.is_valid(), serializer.errors

    def test_apply_discount_sets_discount_on_plan(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner, is_active=True, discount_amount=Decimal('5.00'))
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert serializer.is_valid()
        result = serializer.apply_discount()
        assert result['code'] == dc.code
        assert Decimal(result['discount_amount']) == Decimal('5.00')

    def test_apply_discount_clears_when_empty_code(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner)
        plan = UpfrontPlanFactory(user=user)
        plan.discount_code = dc
        plan.discount_amount = Decimal('5.00')
        plan.save()
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': '', 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        assert serializer.is_valid()
        result = serializer.apply_discount()
        assert result['code'] is None

    def test_apply_discount_sets_referred_by_partner(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        plan = UpfrontPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'upfront'},
            context={'request': request},
        )
        serializer.is_valid()
        serializer.apply_discount()
        user.refresh_from_db()
        assert user.referred_by_partner == partner

    def test_subscription_plan_type_works(self):
        user = UserFactory()
        partner = PartnerFactory(status='active')
        dc = DiscountCodeFactory(partner=partner, is_active=True)
        plan = SubscriptionPlanFactory(user=user)
        request = make_request(user)
        serializer = ValidateDiscountCodeSerializer(
            data={'code': dc.code, 'plan_id': plan.pk, 'plan_type': 'subscription'},
            context={'request': request},
        )
        assert serializer.is_valid(), serializer.errors
