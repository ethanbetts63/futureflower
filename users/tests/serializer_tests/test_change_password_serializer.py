# users/tests/serializer_tests/test_change_password_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.change_password_serializer import ChangePasswordSerializer
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
def test_change_password_success(drf_request_factory, mocker):
    """
    Tests that a user can successfully change their password.
    """
    user = UserFactory(password="old_password")
    request = drf_request_factory(user=user)
    mock_update_hash = mocker.patch('users.serializers.change_password_serializer.update_session_auth_hash')

    data = {
        "old_password": "old_password",
        "new_password": "new_strong_password_123",
        "new_password_confirm": "new_strong_password_123",
    }
    
    serializer = ChangePasswordSerializer(data=data, context={'request': request})
    assert serializer.is_valid(raise_exception=True)
    serializer.save()

    user.refresh_from_db()
    assert user.check_password("new_strong_password_123")
    mock_update_hash.assert_called_once_with(request, user)

@pytest.mark.django_db
def test_change_password_incorrect_old_password(drf_request_factory):
    """
    Tests that a validation error is raised for an incorrect old password.
    """
    user = UserFactory(password="old_password")
    request = drf_request_factory(user=user)
    
    data = {
        "old_password": "wrong_old_password",
        "new_password": "new_strong_password_123",
        "new_password_confirm": "new_strong_password_123",
    }
    
    serializer = ChangePasswordSerializer(data=data, context={'request': request})
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    
    assert "old_password" in excinfo.value.detail

@pytest.mark.django_db
def test_change_password_mismatch(drf_request_factory):
    """
    Tests that a validation error is raised when new passwords do not match.
    """
    user = UserFactory(password="old_password")
    request = drf_request_factory(user=user)
    
    data = {
        "old_password": "old_password",
        "new_password": "new_strong_password_123",
        "new_password_confirm": "DIFFERENT_password_123",
    }
    
    serializer = ChangePasswordSerializer(data=data, context={'request': request})
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
        
    assert "new_password_confirm" in excinfo.value.detail

@pytest.mark.django_db
def test_change_password_fails_django_validation(drf_request_factory):
    """
    Tests that the serializer fails if the new password doesn't meet
    Django's password strength requirements (e.g., too short).
    """
    user = UserFactory(password="old_password")
    request = drf_request_factory(user=user)
    
    data = {
        "old_password": "old_password",
        "new_password": "short",
        "new_password_confirm": "short",
    }
    
    serializer = ChangePasswordSerializer(data=data, context={'request': request})
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
        
    assert "new_password" in excinfo.value.detail
