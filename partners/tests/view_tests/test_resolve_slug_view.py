import pytest
from rest_framework.test import APIClient
from partners.tests.factories.partner_factory import PartnerFactory

@pytest.mark.django_db
class TestResolveSlugView:
    def setup_method(self):
        self.client = APIClient()
        self.url_base = '/api/partners/resolve-slug/'

    def test_resolve_slug_success(self):
        partner = PartnerFactory(booking_slug="test-slug", partner_type='delivery', status='active')
        response = self.client.get(f"{self.url_base}test-slug/")
        assert response.status_code == 200
        assert response.data['partner_id'] == partner.id

    def test_resolve_slug_not_delivery_fails(self):
        partner = PartnerFactory(booking_slug="non-delivery", partner_type='non_delivery', status='active')
        response = self.client.get(f"{self.url_base}non-delivery/")
        assert response.status_code == 404

    def test_resolve_slug_inactive_fails(self):
        partner = PartnerFactory(booking_slug="inactive", partner_type='delivery', status='pending')
        response = self.client.get(f"{self.url_base}inactive/")
        assert response.status_code == 404

    def test_resolve_slug_not_found(self):
        response = self.client.get(f"{self.url_base}unknown/")
        assert response.status_code == 404
