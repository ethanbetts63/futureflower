# conftest.py
import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request

@pytest.fixture
def api_rf():
    """A pytest fixture that returns an instance of DRF's APIRequestFactory."""
    return APIRequestFactory()

@pytest.fixture
def drf_request_factory(api_rf):
    """
    A pytest fixture that provides a factory function for creating DRF Request objects.
    This is useful for unit testing serializers that require a request context.
    """
    def _make(method="post", path="/", data=None, user=None, format="json"):
        """
        Creates a DRF Request object.

        Args:
            method (str): The HTTP method to use (e.g., 'get', 'post').
            path (str): The request path.
            data (dict): The request data.
            user (User): The user to associate with the request.
            format (str): The request format.

        Returns:
            A DRF Request object.
        """
        # Use the provided api_rf fixture to create a Django HttpRequest
        req = getattr(api_rf, method)(path, data or {}, format=format)
        
        # Wrap the Django HttpRequest in a DRF Request
        drf_req = Request(req)
        
        # If a user is provided, attach it to the DRF Request
        if user is not None:
            drf_req.user = user
            
        return drf_req
        
    return _make
