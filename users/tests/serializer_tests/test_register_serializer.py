# users/tests/serializer_tests/test_register_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.register_serializer import RegisterSerializer
from users.tests.factories.user_factory import UserFactory
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_register_serializer_success():
    """
    Tests that the RegisterSerializer successfully creates a new user
    with valid data.
    """
    user_data = {
        "email": "test@example.com",
        "password": "strongpassword123",
        "first_name": "Test",
        "last_name": "User",
    }

    serializer = RegisterSerializer(data=user_data)
    assert serializer.is_valid(raise_exception=True)
    user = serializer.save()

    assert User.objects.count() == 1
    assert user.email == user_data['email']
    assert user.username == user_data['email'] # Check username is set to email
    assert user.first_name == user_data['first_name']
    assert user.check_password(user_data['password']) # Check password is set correctly
    assert not user.is_staff
    assert not user.is_superuser


@pytest.mark.django_db
def test_register_serializer_duplicate_email():
    """
    Tests that the serializer raises a validation error for a duplicate email.
    """
    # Create an existing user with the email we're going to test
    existing_user = UserFactory(email="test@example.com")
    
    user_data = {
        "email": "Test@example.com",  # Use different casing to test case-insensitivity
        "password": "strongpassword123",
        "first_name": "Test",
        "last_name": "User",
    }

    serializer = RegisterSerializer(data=user_data)
    
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    
    assert 'email' in excinfo.value.detail
    assert "An account with this email address already exists." in str(excinfo.value.detail['email'])


@pytest.mark.django_db
def test_password_is_write_only():
    """
    Tests that the password is not included in the serialized output (if any).
    The RegisterSerializer is primarily for writing, but this confirms the field setting.
    """
    user_data = {
        "email": "test@example.com",
        "password": "strongpassword123",
        "first_name": "Test",
        "last_name": "User",
    }
    serializer = RegisterSerializer(data=user_data)
    assert serializer.is_valid(raise_exception=True)
        # The 'data' property shouldn't contain the password after validation
        assert 'password' not in serializer.data
    
    
    @pytest.mark.django_db
    def test_register_serializer_with_partner():
        """
        Tests that the serializer correctly links a valid delivery partner.
        """
        from users.tests.factories.partner_factory import PartnerFactory
        partner = PartnerFactory(partner_type='delivery', status='active')
        
        user_data = {
            "email": "partner_test@example.com",
            "password": "strongpassword123",
            "first_name": "Partner",
            "last_name": "Test",
            "source_partner_id": partner.id
        }
    
        serializer = RegisterSerializer(data=user_data)
        assert serializer.is_valid(raise_exception=True)
        user = serializer.save()
    
        assert user.source_partner == partner
    
    
    @pytest.mark.django_db
    def test_register_serializer_invalid_partner():
        """
        Tests that the serializer rejects invalid partners (wrong type or inactive).
        """
        from users.tests.factories.partner_factory import PartnerFactory
        inactive_partner = PartnerFactory(partner_type='delivery', status='pending')
        retail_partner = PartnerFactory(partner_type='non_delivery', status='active')
        
        # Test inactive
        data_inactive = {
            "email": "test1@example.com",
            "password": "password123",
            "first_name": "A", "last_name": "B",
            "source_partner_id": inactive_partner.id
        }
        serializer = RegisterSerializer(data=data_inactive)
        with pytest.raises(serializers.ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "source_partner_id" in excinfo.value.detail
    
        # Test wrong type
        data_retail = {
            "email": "test2@example.com",
            "password": "password123",
            "first_name": "A", "last_name": "B",
            "source_partner_id": retail_partner.id
        }
        serializer = RegisterSerializer(data=data_retail)
        with pytest.raises(serializers.ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "source_partner_id" in excinfo.value.detail
    