pytest_plugins = ("pytest_django", )

# conftest.py
import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from unittest.mock import patch

# Global patches that start before any tests run
# This is an extra safety layer in case module-level imports capture the real functions
patch('data_management.utils.send_notification.send_notification').start()
patch('payments.utils.send_admin_payment_notification.send_admin_payment_notification').start()
patch('payments.utils.send_admin_payment_notification.send_admin_cancellation_notification').start()
# We don't mock send_customer_payment_notification globally because it has its own unit tests
# that need to check if it's called. Instead, we mock it in specific integration tests.
patch('twilio.rest.Client').start()

@pytest.fixture(autouse=True)
def mock_notifications_fixture():
    """
    Ensures notifications are mocked for every test.
    The .start() above handles the global state, this fixture is for consistency.
    """
    yield

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
        """
        req = getattr(api_rf, method)(path, data or {}, format=format)
        drf_req = Request(req)
        if user is not None:
            drf_req.user = user
        return drf_req
        
    return _make
