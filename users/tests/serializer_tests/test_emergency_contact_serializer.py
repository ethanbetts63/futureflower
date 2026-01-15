# users/tests/serializer_tests/test_emergency_contact_serializer.py
import pytest
from users.serializers.emergency_contact_serializer import EmergencyContactSerializer
from users.tests.factories.emergency_contact_factory import EmergencyContactFactory
from users.tests.factories.user_factory import UserFactory
from users.models import EmergencyContact

@pytest.mark.django_db
def test_emergency_contact_serialization():
    """
    Tests that the EmergencyContactSerializer correctly serializes an
    EmergencyContact object.
    """
    contact = EmergencyContactFactory()
    serializer = EmergencyContactSerializer(instance=contact)

    expected_data = {
        'id': contact.id,
        'first_name': contact.first_name,
        'last_name': contact.last_name,
        'relationship': contact.relationship,
        'phone': contact.phone,
        'email': contact.email,
    }

    assert serializer.data == expected_data

@pytest.mark.django_db
def test_emergency_contact_deserialization_and_create():
    """
    Tests that the EmergencyContactSerializer can correctly deserialize
    data and create an EmergencyContact object when the user is passed
    in the save() method.
    """
    user = UserFactory()
    contact_data = {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'relationship': 'Spouse',
        'phone': '123-456-7890',
        'email': 'jane.doe@example.com',
    }

    serializer = EmergencyContactSerializer(data=contact_data)
    assert serializer.is_valid(raise_exception=True)

    # Mimic the view's behavior by passing the user to save()
    contact = serializer.save(user=user)

    assert contact.user == user
    assert contact.first_name == contact_data['first_name']
    assert EmergencyContact.objects.count() == 1
