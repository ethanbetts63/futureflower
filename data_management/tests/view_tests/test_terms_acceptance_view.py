import pytest
from rest_framework.test import APIClient
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory
from data_management.models import TermsAcceptance
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAcceptTermsView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def _url(self):
        return '/api/data/terms/accept/'

    def test_creates_acceptance_returns_201(self):
        terms = TermsAndConditionsFactory(terms_type='customer')
        response = self.client.post(self._url(), {'terms_type': 'customer'}, format='json')
        assert response.status_code == 201
        assert response.data['accepted'] is True
        assert response.data['created'] is True

    def test_returns_200_if_already_accepted(self):
        terms = TermsAndConditionsFactory(terms_type='customer')
        self.client.post(self._url(), {'terms_type': 'customer'}, format='json')
        response = self.client.post(self._url(), {'terms_type': 'customer'}, format='json')
        assert response.status_code == 200
        assert response.data['accepted'] is True
        assert response.data['created'] is False

    def test_400_for_invalid_type(self):
        response = self.client.post(self._url(), {'terms_type': 'invalid'}, format='json')
        assert response.status_code == 400

    def test_400_for_missing_type(self):
        response = self.client.post(self._url(), {}, format='json')
        assert response.status_code == 400

    def test_404_if_no_terms_exist_for_type(self):
        response = self.client.post(self._url(), {'terms_type': 'affiliate'}, format='json')
        assert response.status_code == 404

    def test_requires_authentication(self):
        client = APIClient()
        TermsAndConditionsFactory(terms_type='customer')
        response = client.post(self._url(), {'terms_type': 'customer'}, format='json')
        assert response.status_code == 401

    def test_creates_acceptance_record_in_db(self):
        terms = TermsAndConditionsFactory(terms_type='customer')
        self.client.post(self._url(), {'terms_type': 'customer'}, format='json')
        assert TermsAcceptance.objects.filter(user=self.user, terms=terms).exists()

    def test_accepts_florist_type(self):
        TermsAndConditionsFactory(terms_type='florist')
        response = self.client.post(self._url(), {'terms_type': 'florist'}, format='json')
        assert response.status_code == 201

    def test_accepts_affiliate_type(self):
        TermsAndConditionsFactory(terms_type='affiliate')
        response = self.client.post(self._url(), {'terms_type': 'affiliate'}, format='json')
        assert response.status_code == 201

    def test_uses_latest_terms_when_multiple_exist(self):
        from django.utils import timezone
        from datetime import timedelta
        old = TermsAndConditionsFactory(terms_type='customer', published_at=timezone.now() - timedelta(days=10))
        latest = TermsAndConditionsFactory(terms_type='customer', published_at=timezone.now())
        self.client.post(self._url(), {'terms_type': 'customer'}, format='json')
        assert TermsAcceptance.objects.filter(user=self.user, terms=latest).exists()
        assert not TermsAcceptance.objects.filter(user=self.user, terms=old).exists()
