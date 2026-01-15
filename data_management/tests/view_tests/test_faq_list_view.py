# data_management/tests/view_tests/test_faq_list_view.py
import pytest
from rest_framework.test import APIClient
from data_management.tests.factories.faq_factory import FAQFactory
from data_management.models import FAQ

@pytest.mark.django_db
def test_faq_list_view_with_page_param():
    """
    Tests that the view returns a list of FAQs filtered by the 'page' query param.
    """
    client = APIClient()
    
    # Create FAQs for a specific page
    FAQFactory.create_batch(3, pages=["homepage", "pricing"])
    # Create FAQs for another page
    FAQFactory.create_batch(2, pages=["about"])

    assert FAQ.objects.count() == 5

    response = client.get('/api/data/faqs/?page=homepage')
    
    assert response.status_code == 200
    assert len(response.data) == 3

@pytest.mark.django_db
def test_faq_list_view_no_matching_page():
    """
    Tests that the view returns an empty list when the 'page' param matches no FAQs.
    """
    client = APIClient()
    FAQFactory.create_batch(5, pages=["other_page"])
    
    response = client.get('/api/data/faqs/?page=nonexistent_page')
    
    assert response.status_code == 200
    assert len(response.data) == 0

@pytest.mark.django_db
def test_faq_list_view_no_page_param():
    """
    Tests that the view returns an empty list when no 'page' query param is provided.
    """
    client = APIClient()
    FAQFactory.create_batch(5, pages=["any_page"])
    
    response = client.get('/api/data/faqs/')
    
    assert response.status_code == 200
    assert len(response.data) == 0

@pytest.mark.django_db
def test_faq_list_view_is_public():
    """
    Tests that the view can be accessed without authentication.
    """
    client = APIClient()
    response = client.get('/api/data/faqs/')
    assert response.status_code == 200