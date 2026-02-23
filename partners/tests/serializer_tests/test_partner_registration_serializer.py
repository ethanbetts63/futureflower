import pytest
from unittest.mock import patch, MagicMock
from partners.serializers.partner_registration_serializer import PartnerRegistrationSerializer
from partners.models import Partner, DiscountCode
from users.tests.factories.user_factory import UserFactory
from django.contrib.auth import get_user_model

User = get_user_model()


def _valid_data(**overrides):
    data = {
        'email': 'newpartner@example.com',
        'password': 'securepassword123',
        'first_name': 'Test',
        'last_name': 'Partner',
        'business_name': 'My Flower Shop',
        'phone': '+15551234567',
        'partner_type': 'non_delivery',
    }
    data.update(overrides)
    return data


@pytest.mark.django_db
class TestPartnerRegistrationSerializer:

    def test_valid_non_delivery_data_is_valid(self):
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.return_value = MagicMock(id='acct_test')
            serializer = PartnerRegistrationSerializer(data=_valid_data())
            assert serializer.is_valid(), serializer.errors

    def test_duplicate_email_fails_validation(self):
        UserFactory(email='existing@example.com')
        serializer = PartnerRegistrationSerializer(
            data=_valid_data(email='existing@example.com')
        )
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_email_case_insensitive_duplicate_check(self):
        UserFactory(email='existing@example.com')
        serializer = PartnerRegistrationSerializer(
            data=_valid_data(email='EXISTING@example.com')
        )
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_delivery_partner_without_lat_lng_fails(self):
        data = _valid_data(partner_type='delivery', latitude=None, longitude=None)
        serializer = PartnerRegistrationSerializer(data=data)
        assert not serializer.is_valid()

    def test_delivery_partner_with_lat_lng_is_valid(self):
        data = _valid_data(partner_type='delivery', latitude=40.7128, longitude=-74.0060)
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.return_value = MagicMock(id='acct_test')
            serializer = PartnerRegistrationSerializer(data=data)
            assert serializer.is_valid(), serializer.errors

    def test_create_creates_user_and_partner(self):
        data = _valid_data()
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.return_value = MagicMock(id='acct_test')
            serializer = PartnerRegistrationSerializer(data=data)
            assert serializer.is_valid()
            user = serializer.save()

        assert User.objects.filter(email='newpartner@example.com').exists()
        assert Partner.objects.filter(user=user).exists()

    def test_create_generates_discount_code(self):
        data = _valid_data(business_name='Code Test Shop')
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.return_value = MagicMock(id='acct_test')
            serializer = PartnerRegistrationSerializer(data=data)
            assert serializer.is_valid()
            user = serializer.save()

        partner = Partner.objects.get(user=user)
        assert DiscountCode.objects.filter(partner=partner).exists()

    def test_create_normalizes_email_to_lowercase(self):
        data = _valid_data(email='TestEmail@Example.COM')
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.return_value = MagicMock(id='acct_test')
            serializer = PartnerRegistrationSerializer(data=data)
            assert serializer.is_valid()
            user = serializer.save()

        assert user.email == 'testemail@example.com'

    def test_create_stripe_failure_does_not_raise(self):
        data = _valid_data()
        with patch('partners.serializers.partner_registration_serializer.stripe') as mock_stripe:
            mock_stripe.Account.create.side_effect = Exception('Stripe error')
            serializer = PartnerRegistrationSerializer(data=data)
            assert serializer.is_valid()
            user = serializer.save()  # Should not raise

        assert User.objects.filter(email='newpartner@example.com').exists()
