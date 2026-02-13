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
        'is_partner': False,
    }

    assert serializer.data == expected_data
