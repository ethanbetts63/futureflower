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


@pytest.mark.django_db
def test_user_profile_serializer_is_partner_true():
    """
    Tests that is_partner returns True if the user has a partner profile.
    """
    from partners.tests.factories.partner_factory import PartnerFactory
    partner = PartnerFactory()
    user = partner.user
    
    serializer = UserProfileSerializer(instance=user)
    assert serializer.data['is_partner'] is True
