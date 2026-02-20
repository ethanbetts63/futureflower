# data_management/tests/view_tests/test_terms_and_conditions_view.py
import pytest
from rest_framework.test import APIClient
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory
from data_management.models import TermsAndConditions
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache

@pytest.mark.django_db
class TestTermsAndConditionsView:

    def setup_method(self):
        self.client = APIClient()
        cache.clear()

    def test_latest_terms_and_conditions_success_customer(self):
        """
        Tests that the view returns the most recently published Customer Terms and Conditions.
        """
        # Create older customer terms
        TermsAndConditionsFactory(terms_type='customer', version="1.0", published_at=timezone.now() - timedelta(days=10))
        # Create the most recent customer terms
        latest_terms = TermsAndConditionsFactory(terms_type='customer', version="2.0", published_at=timezone.now() - timedelta(days=1))
        # Create florist terms (should be ignored)
        TermsAndConditionsFactory(terms_type='florist', version="1.0", published_at=timezone.now())

        response = self.client.get('/api/data/terms/latest/', {'type': 'customer'})
        
        assert response.status_code == 200
        assert response.data['version'] == "2.0"
        assert response.data['terms_type'] == 'customer'

    def test_latest_terms_and_conditions_success_florist(self):
        """
        Tests that the view returns the most recently published Florist Terms and Conditions.
        """
        TermsAndConditionsFactory(terms_type='florist', version="1.5", published_at=timezone.now())
        
        response = self.client.get('/api/data/terms/latest/', {'type': 'florist'})
        
        assert response.status_code == 200
        assert response.data['version'] == "1.5"
        assert response.data['terms_type'] == 'florist'

    def test_latest_terms_and_conditions_missing_type(self):
        """
        Tests that the view returns 400 Bad Request if the type parameter is missing.
        """
        response = self.client.get('/api/data/terms/latest/')
        assert response.status_code == 400
        assert "A valid 'type' query parameter is required" in response.data['detail']

    def test_latest_terms_and_conditions_invalid_type(self):
        """
        Tests that the view returns 400 Bad Request if an invalid type is provided.
        """
        response = self.client.get('/api/data/terms/latest/', {'type': 'invalid'})
        assert response.status_code == 400
        assert "A valid 'type' query parameter is required" in response.data['detail']

    def test_latest_terms_and_conditions_not_found(self):
        """
        Tests that the view returns a 404 Not Found status when no terms exist for the given type.
        """
        # Create customer terms but search for florist
        TermsAndConditionsFactory(terms_type='customer')
        
        response = self.client.get('/api/data/terms/latest/', {'type': 'florist'})
        
        assert response.status_code == 404
        assert "No Terms and Conditions found" in response.data['detail']
