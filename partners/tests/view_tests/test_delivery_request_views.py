import pytest
from rest_framework.test import APIClient
from partners.tests.factories.delivery_request_factory import DeliveryRequestFactory
from partners.tests.factories.partner_factory import PartnerFactory
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory
from partners.models import Commission

@pytest.mark.django_db
class TestDeliveryRequestViews:
    def setup_method(self):
        self.client = APIClient()

    def test_detail_view_success(self):
        dr = DeliveryRequestFactory()
        url = f"/api/partners/delivery-requests/{dr.token}/details/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['id'] == dr.id

    def test_respond_accept_success(self):
        dr = DeliveryRequestFactory(status='pending')
        url = f"/api/partners/delivery-requests/{dr.token}/respond/"
        response = self.client.post(url, {"action": "accept"}, format='json')
        
        assert response.status_code == 200
        dr.refresh_from_db()
        assert dr.status == 'accepted'

    def test_respond_decline_creates_commission_if_sourced(self, mocker):
        # Mock reassign_delivery_request to avoid side effects
        mocker.patch('partners.utils.reassignment.reassign_delivery_request')
        
        partner = PartnerFactory()
        user = UserFactory(source_partner=partner)
        event = EventFactory(order__user=user, order__budget=100)
        dr = DeliveryRequestFactory(partner=partner, event=event, status='pending')
        
        url = f"/api/partners/delivery-requests/{dr.token}/respond/"
        response = self.client.post(url, {"action": "decline"}, format='json')
        
        assert response.status_code == 200
        dr.refresh_from_db()
        assert dr.status == 'declined'
        
        # Check commission
        from decimal import Decimal
        commission = Commission.objects.get(partner=partner, event=event)
        assert commission.amount == Decimal('5.00')

    def test_mark_delivered_success(self):
        dr = DeliveryRequestFactory(status='accepted')
        url = f"/api/partners/delivery-requests/{dr.token}/mark-delivered/"
        response = self.client.post(url)
        
        assert response.status_code == 200
        dr.event.refresh_from_db()
        assert dr.event.status == 'delivered'
