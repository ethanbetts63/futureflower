# users/tests/serializer_tests/test_password_reset_confirm_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.password_reset_confirm_serializer import PasswordResetConfirmSerializer

def test_password_reset_confirm_success():
    """
    Tests that the serializer validates successfully with matching, valid passwords.
    """
    data = {
        "password": "new_strong_password_123",
        "password_confirm": "new_strong_password_123",
    }
    serializer = PasswordResetConfirmSerializer(data=data)
    assert serializer.is_valid(raise_exception=True)

def test_password_reset_confirm_mismatch():
    """
    Tests that a validation error is raised when passwords do not match.
    """
    data = {
        "password": "new_strong_password_123",
        "password_confirm": "DIFFERENT_password_123",
    }
    serializer = PasswordResetConfirmSerializer(data=data)
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    assert "password_confirm" in excinfo.value.detail

def test_password_reset_confirm_too_short():
    """

    Tests that a validation error is raised if the password is too short.
    """
    data = {
        "password": "short",
        "password_confirm": "short",
    }
    serializer = PasswordResetConfirmSerializer(data=data)
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    assert "password" in excinfo.value.detail
