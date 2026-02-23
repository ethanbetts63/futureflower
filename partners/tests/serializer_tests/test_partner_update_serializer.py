import pytest
from partners.serializers.partner_update_serializer import PartnerUpdateSerializer
from partners.tests.factories.partner_factory import PartnerFactory


@pytest.mark.django_db
class TestPartnerUpdateSerializer:

    def test_valid_update_for_non_delivery_partner(self):
        partner = PartnerFactory(partner_type='non_delivery')
        serializer = PartnerUpdateSerializer(
            instance=partner, data={'business_name': 'New Name'}, partial=True
        )
        assert serializer.is_valid(), serializer.errors

    def test_delivery_partner_update_with_lat_lng_is_valid(self):
        partner = PartnerFactory(partner_type='delivery', latitude=40.0, longitude=-74.0)
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'business_name': 'Updated Shop', 'latitude': 40.1, 'longitude': -74.1},
            partial=True,
        )
        assert serializer.is_valid(), serializer.errors

    def test_delivery_partner_clearing_lat_fails(self):
        partner = PartnerFactory(partner_type='delivery', latitude=40.0, longitude=-74.0)
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'latitude': None},
            partial=True,
        )
        assert not serializer.is_valid()
        assert 'latitude' in serializer.errors

    def test_delivery_partner_inherits_existing_lat_when_not_updating(self):
        partner = PartnerFactory(partner_type='delivery', latitude=40.0, longitude=-74.0)
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'phone': '+15551234567'},
            partial=True,
        )
        assert serializer.is_valid(), serializer.errors

    def test_non_delivery_partner_update_no_lat_lng_ok(self):
        partner = PartnerFactory(partner_type='non_delivery')
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'phone': '+15551234567'},
            partial=True,
        )
        assert serializer.is_valid(), serializer.errors

    def test_update_saves_business_name(self):
        partner = PartnerFactory(partner_type='non_delivery', business_name='Old Name')
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'business_name': 'New Name'},
            partial=True,
        )
        assert serializer.is_valid()
        updated = serializer.save()
        assert updated.business_name == 'New Name'

    def test_update_saves_phone(self):
        partner = PartnerFactory(partner_type='non_delivery')
        serializer = PartnerUpdateSerializer(
            instance=partner,
            data={'phone': '+15559876543'},
            partial=True,
        )
        assert serializer.is_valid()
        updated = serializer.save()
        assert updated.phone == '+15559876543'
