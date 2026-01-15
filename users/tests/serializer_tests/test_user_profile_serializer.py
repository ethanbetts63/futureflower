# users/tests/serializer_tests/test_user_profile_serializer.py
import pytest
from users.serializers.user_profile_serializer import UserProfileSerializer
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
def test_user_profile_serializer():
    """
    Tests that the UserProfileSerializer correctly serializes a User object.
    """
    user = UserFactory()
    serializer = UserProfileSerializer(instance=user)

    expected_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'country_code': user.country_code,
        'phone': user.phone,
        'backup_email': user.backup_email,
        'secondary_backup_email': user.secondary_backup_email,
        'backup_phone': user.backup_phone,
        'facebook_handle': user.facebook_handle,
        'instagram_handle': user.instagram_handle,
        'snapchat_handle': user.snapchat_handle,
        'x_handle': user.x_handle,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_email_verified': user.is_email_verified,
    }

    assert serializer.data == expected_data
