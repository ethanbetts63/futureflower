import pytest
from data_management.models import TermsAndConditions
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

@pytest.mark.django_db
class TestTermsAndConditionsModel:

    def test_customer_terms_creation(self):
        """
        Tests creating customer terms.
        """
        terms = TermsAndConditionsFactory(terms_type='customer', version="1.0")
        assert isinstance(terms, TermsAndConditions)
        assert terms.terms_type == 'customer'
        assert str(terms) == "Customer Terms and Conditions v1.0"

    def test_florist_terms_creation(self):
        """
        Tests creating florist terms.
        """
        terms = TermsAndConditionsFactory(terms_type='florist', version="1.0")
        assert isinstance(terms, TermsAndConditions)
        assert terms.terms_type == 'florist'
        assert str(terms) == "Florist Terms and Conditions v1.0"

    def test_affiliate_terms_creation(self):
        """
        Tests creating affiliate terms.
        """
        terms = TermsAndConditionsFactory(terms_type='affiliate', version="1.0")
        assert isinstance(terms, TermsAndConditions)
        assert terms.terms_type == 'affiliate'
        assert str(terms) == "Affiliate Terms and Conditions v1.0"
