from rest_framework import serializers
from partners.models import Partner


class PartnerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            'business_name', 'phone', 'booking_slug',
            'street_address', 'suburb', 'city', 'state', 'postcode', 'country',
            'latitude', 'longitude', 'service_radius_km',
        ]

    def validate(self, data):
        partner = self.instance
        is_delivery = partner.partner_type == 'delivery'

        if is_delivery:
            lat = data.get('latitude', partner.latitude)
            lng = data.get('longitude', partner.longitude)
            if lat is None or lng is None:
                raise serializers.ValidationError({
                    'latitude': 'Delivery partners must set a location on the map.'
                })

        return data
