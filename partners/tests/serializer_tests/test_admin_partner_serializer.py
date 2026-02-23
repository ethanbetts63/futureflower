import pytest
from partners.serializers.admin_partner_serializer import AdminPartnerSerializer
from partners.tests.factories.partner_factory import PartnerFactory
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestAdminPartnerSerializer:

    def test_includes_user_email(self):
        user = UserFactory(email='florist@example.com')
        partner = PartnerFactory(user=user)
        data = AdminPartnerSerializer(partner).data
        assert data['email'] == 'florist@example.com'

    def test_includes_user_first_and_last_name(self):
        user = UserFactory(first_name='Alice', last_name='Wonder')
        partner = PartnerFactory(user=user)
        data = AdminPartnerSerializer(partner).data
        assert data['first_name'] == 'Alice'
        assert data['last_name'] == 'Wonder'

    def test_includes_partner_business_name(self):
        partner = PartnerFactory(business_name='Bloom Shop')
        data = AdminPartnerSerializer(partner).data
        assert data['business_name'] == 'Bloom Shop'

    def test_includes_partner_type(self):
        partner = PartnerFactory(partner_type='delivery')
        data = AdminPartnerSerializer(partner).data
        assert data['partner_type'] == 'delivery'

    def test_includes_status(self):
        partner = PartnerFactory(status='active')
        data = AdminPartnerSerializer(partner).data
        assert data['status'] == 'active'

    def test_includes_phone(self):
        partner = PartnerFactory(phone='+15551234567')
        data = AdminPartnerSerializer(partner).data
        assert data['phone'] == '+15551234567'

    def test_includes_location_fields(self):
        partner = PartnerFactory()
        partner.latitude = 40.7128
        partner.longitude = -74.0060
        partner.service_radius_km = 25
        partner.save()
        data = AdminPartnerSerializer(partner).data
        assert data['latitude'] == 40.7128
        assert data['longitude'] == -74.0060
        assert data['service_radius_km'] == 25

    def test_includes_created_at(self):
        partner = PartnerFactory()
        data = AdminPartnerSerializer(partner).data
        assert 'created_at' in data

    def test_id_is_present(self):
        partner = PartnerFactory()
        data = AdminPartnerSerializer(partner).data
        assert 'id' in data
        assert data['id'] == partner.pk
