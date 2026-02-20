import pytest
from django.db import IntegrityError
from data_management.tests.factories.terms_acceptance_factory import TermsAcceptanceFactory
from users.tests.factories.user_factory import UserFactory
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

@pytest.mark.django_db
def test_terms_acceptance_creation():
    """
    Test that a TermsAcceptance can be created and has correct string representation.
    """
    user = UserFactory()
    terms = TermsAndConditionsFactory()
    acceptance = TermsAcceptanceFactory(user=user, terms=terms)
    
    assert acceptance.user == user
    assert acceptance.terms == terms
    assert acceptance.accepted_at is not None
    assert str(acceptance) == f"{user} accepted {terms} at {acceptance.accepted_at}"

@pytest.mark.django_db
def test_unique_user_terms():
    """
    Test that a user can only accept a specific version of terms once.
    """
    user = UserFactory()
    terms = TermsAndConditionsFactory()
    TermsAcceptanceFactory(user=user, terms=terms)
    
    with pytest.raises(IntegrityError):
        TermsAcceptanceFactory(user=user, terms=terms)
