import factory
from factory.django import DjangoModelFactory
from data_management.models import TermsAcceptance
from users.tests.factories.user_factory import UserFactory
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

class TermsAcceptanceFactory(DjangoModelFactory):
    class Meta:
        model = TermsAcceptance

    user = factory.SubFactory(UserFactory)
    terms = factory.SubFactory(TermsAndConditionsFactory)
