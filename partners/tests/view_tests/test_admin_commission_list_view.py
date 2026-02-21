import pytest
from decimal import Decimal
from rest_framework.test import APIClient
from partners.tests.factories.partner_factory import PartnerFactory
from partners.tests.factories.commission_factory import CommissionFactory
from users.tests.factories.user_factory import UserFactory

URL = '/api/partners/admin/commissions/'


@pytest.mark.django_db
class TestAdminCommissionListView:
    def setup_method(self):
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def test_returns_all_commissions(self):
        CommissionFactory(status='pending')
        CommissionFactory(status='paid')
        CommissionFactory(status='denied')

        response = self.client.get(URL)

        assert response.status_code == 200
        assert len(response.data) == 3

    def test_ordered_newest_first(self):
        c1 = CommissionFactory(status='pending')
        c2 = CommissionFactory(status='pending')

        response = self.client.get(URL)

        ids = [c['id'] for c in response.data]
        assert ids.index(c2.id) < ids.index(c1.id)

    def test_filter_by_status(self):
        CommissionFactory(status='pending')
        CommissionFactory(status='pending')
        CommissionFactory(status='paid')

        response = self.client.get(URL + '?status=pending')

        assert response.status_code == 200
        assert len(response.data) == 2
        assert all(c['status'] == 'pending' for c in response.data)

    def test_filter_by_commission_type(self):
        CommissionFactory(commission_type='referral')
        CommissionFactory(commission_type='referral')
        CommissionFactory(commission_type='fulfillment')

        response = self.client.get(URL + '?commission_type=referral')

        assert response.status_code == 200
        assert len(response.data) == 2
        assert all(c['commission_type'] == 'referral' for c in response.data)

    def test_filter_by_status_and_type_combined(self):
        CommissionFactory(status='pending', commission_type='referral')
        CommissionFactory(status='pending', commission_type='fulfillment')
        CommissionFactory(status='paid', commission_type='referral')

        response = self.client.get(URL + '?status=pending&commission_type=referral')

        assert response.status_code == 200
        assert len(response.data) == 1

    def test_response_includes_partner_name(self):
        partner = PartnerFactory(business_name='Blooms & Co')
        CommissionFactory(partner=partner)

        response = self.client.get(URL)

        assert response.data[0]['partner_name'] == 'Blooms & Co'

    def test_partner_name_falls_back_to_full_name(self):
        partner = PartnerFactory(business_name='')
        partner.user.first_name = 'Jane'
        partner.user.last_name = 'Smith'
        partner.user.save()
        CommissionFactory(partner=partner)

        response = self.client.get(URL)

        assert response.data[0]['partner_name'] == 'Jane Smith'

    def test_response_includes_partner_id_and_type(self):
        partner = PartnerFactory(partner_type='delivery')
        CommissionFactory(partner=partner)

        response = self.client.get(URL)

        assert response.data[0]['partner_id'] == partner.id
        assert response.data[0]['partner_type'] == 'delivery'

    def test_empty_list_when_no_commissions(self):
        response = self.client.get(URL)
        assert response.status_code == 200
        assert response.data == []

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)

        response = client.get(URL)

        assert response.status_code == 403

    def test_requires_authentication(self):
        client = APIClient()
        response = client.get(URL)
        assert response.status_code == 401

    def test_all_new_statuses_filterable(self):
        CommissionFactory(status='processing')
        CommissionFactory(status='denied')

        resp_processing = self.client.get(URL + '?status=processing')
        resp_denied = self.client.get(URL + '?status=denied')

        assert len(resp_processing.data) == 1
        assert len(resp_denied.data) == 1
