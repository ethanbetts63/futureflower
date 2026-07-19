import pytest
from rest_framework import serializers
from users.serializers.password_reset_request_serializer import EmailSerializer

def test_email_serializer_valid():
    data = {"email": "test@example.com"}
    serializer = EmailSerializer(data=data)
    assert serializer.is_valid(raise_exception=True)
    assert serializer.validated_data == data

def test_email_serializer_invalid():
    data = {"email": "not-an-email"}
    serializer = EmailSerializer(data=data)
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.is_valid(raise_exception=True)
    assert "email" in excinfo.value.detail
