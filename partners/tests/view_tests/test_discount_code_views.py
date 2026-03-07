import pytest
from rest_framework.test import APIClient
from partners.models import DiscountCode
from partners.tests.factories.partner_factory import PartnerFactory
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestDiscountCodeCreateView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.partner = PartnerFactory(user=self.user, business_name='Bloom Studio')
        self.url = '/api/partners/discount-codes/'

    def test_create_generates_code_from_business_name(self):
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 201
        assert 'bloom-studio' in response.data['code']
        assert DiscountCode.objects.filter(partner=self.partner).count() == 1

    def test_create_with_custom_name(self):
        response = self.client.post(self.url, {'name': 'podcast'}, format='json')
        assert response.status_code == 201
        assert 'podcast' in response.data['code']

    def test_create_multiple_codes_allowed(self):
        self.client.post(self.url, {'name': 'spring'}, format='json')
        self.client.post(self.url, {'name': 'summer'}, format='json')
        assert DiscountCode.objects.filter(partner=self.partner).count() == 2

    def test_create_returns_correct_fields(self):
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 201
        for field in ('id', 'code', 'discount_amount', 'is_active', 'total_uses', 'created_at'):
            assert field in response.data

    def test_create_requires_authentication(self):
        self.client.logout()
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 401

    def test_create_requires_partner_profile(self):
        non_partner = UserFactory()
        self.client.force_authenticate(user=non_partner)
        response = self.client.post(self.url, {}, format='json')
        assert response.status_code == 404

    def test_new_code_has_collision_suffix(self):
        # First code uses business name slug
        first = self.client.post(self.url, {'name': 'vip'}, format='json')
        # Second with same name should get a counter suffix
        second = self.client.post(self.url, {'name': 'vip'}, format='json')
        assert first.data['code'] != second.data['code']


@pytest.mark.django_db
class TestDiscountCodeRenameView:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.partner = PartnerFactory(user=self.user)
        self.dc = DiscountCodeFactory(partner=self.partner, code='original-5')

    def url(self, pk=None):
        return f'/api/partners/discount-codes/{pk or self.dc.pk}/'

    def test_rename_success(self):
        response = self.client.patch(self.url(), {'code': 'my-podcast-5'}, format='json')
        assert response.status_code == 200
        assert response.data['code'] == 'my-podcast-5'
        self.dc.refresh_from_db()
        assert self.dc.code == 'my-podcast-5'

    def test_rename_slugifies_input(self):
        response = self.client.patch(self.url(), {'code': 'My Podcast'}, format='json')
        assert response.status_code == 200
        assert response.data['code'] == 'my-podcast'

    def test_rename_empty_code_rejected(self):
        response = self.client.patch(self.url(), {'code': ''}, format='json')
        assert response.status_code == 400

    def test_rename_code_too_long_rejected(self):
        response = self.client.patch(self.url(), {'code': 'a' * 31}, format='json')
        assert response.status_code == 400

    def test_rename_collision_rejected(self):
        other = DiscountCodeFactory(partner=self.partner, code='taken-5')
        response = self.client.patch(self.url(), {'code': 'taken-5'}, format='json')
        assert response.status_code == 400
        assert 'taken' in response.data['error'].lower()

    def test_rename_to_own_code_is_ok(self):
        # Renaming to the same code the code already has should not collide with itself
        response = self.client.patch(self.url(), {'code': 'original-5'}, format='json')
        assert response.status_code == 200

    def test_rename_requires_authentication(self):
        self.client.logout()
        response = self.client.patch(self.url(), {'code': 'newname'}, format='json')
        assert response.status_code == 401

    def test_rename_cannot_edit_another_partners_code(self):
        other_partner = PartnerFactory()
        other_dc = DiscountCodeFactory(partner=other_partner, code='theirs-5')
        response = self.client.patch(self.url(other_dc.pk), {'code': 'stolen'}, format='json')
        assert response.status_code == 404
