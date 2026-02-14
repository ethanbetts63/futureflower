# users/tests/serializer_tests/test_register_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.register_serializer import RegisterSerializer
from users.models import User

@pytest.mark.django_db
def test_register_serializer_valid_data():
    """
    Tests that the RegisterSerializer creates a user with valid data.
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

    assert user.email == "test@example.com"
    assert user.first_name == "Test"
    assert user.last_name == "User"
    assert user.check_password("strongpassword123")
    assert user.is_active is True

@pytest.mark.django_db
def test_register_serializer_duplicate_email():
    """
    Tests that the serializer raises a ValidationError if the email already exists.
    """
    User.objects.create_user(
        username="duplicate@example.com",
        email="duplicate@example.com",
        password="password123"
    )
    
    user_data = {
        "email": "duplicate@example.com",
        "password": "newpassword123",
        "first_name": "New",
        "last_name": "User",
    }
    serializer = RegisterSerializer(data=user_data)
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    
    assert "email" in excinfo.value.detail

@pytest.mark.django_db
def test_register_serializer_missing_fields():
    """
    Tests that the serializer raises a ValidationError if required fields are missing.
    """
    serializer = RegisterSerializer(data={})
    with pytest.raises(serializers.ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_register_serializer_password_hashing():
    """
    Tests that the password is correctly hashed during user creation.
    """
    user_data = {
        "email": "hash_test@example.com",
        "password": "strongpassword123",
        "first_name": "Hash",
        "last_name": "Test",
    }
    serializer = RegisterSerializer(data=user_data)
    assert serializer.is_valid(raise_exception=True)
    user = serializer.save()
    
    assert user.password != "strongpassword123"
    assert user.check_password("strongpassword123")

@pytest.mark.django_db
def test_register_serializer_data_property():
    """
    Tests that the 'data' property of the serializer is accessible after validation.
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
    from partners.tests.factories.partner_factory import PartnerFactory
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
    from partners.tests.factories.partner_factory import PartnerFactory
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
