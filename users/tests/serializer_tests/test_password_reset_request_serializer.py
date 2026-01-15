# users/tests/serializer_tests/test_password_reset_request_serializer.py
import pytest
from rest_framework import serializers
from users.serializers.password_reset_request_serializer import EmailSerializer

def test_email_serializer_valid():
    """
    Tests that a valid email passes validation.
    """
    data = {"email": "test@example.com"}
    serializer = EmailSerializer(data=data)
    assert serializer.is_valid(raise_exception=True)
    assert serializer.validated_data == data

def test_email_serializer_invalid():
    """
    Tests that an invalid email raises a validation error.
    """
    data = {"email": "not-an-email"}
    serializer = EmailSerializer(data=data)
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    assert "email" in excinfo.value.detail
