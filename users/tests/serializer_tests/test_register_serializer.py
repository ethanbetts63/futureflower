# users/tests/serializer_tests/test_register_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.register_serializer import RegisterSerializer
from users.tests.factories.user_factory import UserFactory
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_register_serializer_success(mocker):
    """
    Tests that the RegisterSerializer successfully creates a new user
    with valid data.
    """
    # Mock the email sending function
    mock_send_email = mocker.patch('users.serializers.register_serializer.send_verification_email')

    user_data = {
        "email": "test@example.com",
        "password": "strongpassword123",
        "first_name": "Test",
        "last_name": "User",
        "country_code": "1",
        "phone": "1234567890",
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
    
    # Assert that the email sending function was called once with the new user
    mock_send_email.assert_called_once_with(user)


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