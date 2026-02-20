import pytest
from data_management.serializers.terms_and_conditions_serializer import TermsAndConditionsSerializer
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

@pytest.mark.django_db
class TestTermsAndConditionsSerializer:
    def test_customer_terms_serialization(self):
        """
        Tests serialization of customer terms.
        """
        terms = TermsAndConditionsFactory(terms_type='customer', version="1.0")
        serializer = TermsAndConditionsSerializer(instance=terms)
        data = serializer.data

        assert data['version'] == "1.0"
        assert data['terms_type'] == "customer"
        assert data['content'] == terms.content
        assert data['published_at'] is not None

    def test_florist_terms_serialization(self):
        """
        Tests serialization of florist terms.
        """
        terms = TermsAndConditionsFactory(terms_type='florist', version="1.5")
        serializer = TermsAndConditionsSerializer(instance=terms)
        data = serializer.data

        assert data['version'] == "1.5"
        assert data['terms_type'] == "florist"
        assert data['content'] == terms.content
        assert data['published_at'] is not None
