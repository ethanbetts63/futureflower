# data_management/tests/view_tests/test_terms_and_conditions_view.py
import pytest
from rest_framework.test import APIClient
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory
from data_management.models import TermsAndConditions
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache

@pytest.mark.django_db
def test_latest_terms_and_conditions_success():
    """
    Tests that the view returns the most recently published Terms and Conditions.
    """
    cache.clear() # Clear cache to ensure a fresh response
    client = APIClient()
    
    # Create older terms
    TermsAndConditionsFactory(published_at=timezone.now() - timedelta(days=10))
    # Create the most recent terms
    latest_terms = TermsAndConditionsFactory(published_at=timezone.now() - timedelta(days=1))
    # Create other terms that are not the latest
    TermsAndConditionsFactory(published_at=timezone.now() - timedelta(days=5))

    assert TermsAndConditions.objects.count() == 3

    response = client.get('/api/data/terms/latest/')
    
    assert response.status_code == 200
    # The serializer doesn't include 'id', so we check 'version'
    assert response.data['version'] == latest_terms.version
    assert response.data['content'] == latest_terms.content

@pytest.mark.django_db
def test_latest_terms_and_conditions_not_found():
    """
    Tests that the view returns a 404 Not Found status when no terms exist.
    """
    cache.clear() # Clear cache to ensure the view is actually hit
    client = APIClient()
    
    assert TermsAndConditions.objects.count() == 0
    
    response = client.get('/api/data/terms/latest/')
    
    assert response.status_code == 404
    assert "No Terms and Conditions found" in response.data['detail']
