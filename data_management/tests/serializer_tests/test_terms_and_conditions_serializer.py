import pytest
from data_management.serializers.terms_and_conditions_serializer import TermsAndConditionsSerializer
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

@pytest.mark.django_db
def test_terms_and_conditions_serializer():
    """
    Tests that the TermsAndConditionsSerializer correctly serializes a TermsAndConditions instance.
    """
    terms = TermsAndConditionsFactory()
    serializer = TermsAndConditionsSerializer(instance=terms)
    data = serializer.data

    assert data['version'] == terms.version
    assert data['content'] == terms.content
    assert data['published_at'] is not None
