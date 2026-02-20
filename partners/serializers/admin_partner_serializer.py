from rest_framework import serializers
from partners.models import Partner


class AdminPartnerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Partner
        fields = [
            'id',
            'business_name',
            'partner_type',
            'status',
            'phone',
            'street_address',
            'suburb',
            'city',
            'state',
            'postcode',
            'country',
            'latitude',
            'longitude',
            'service_radius_km',
            'created_at',
            'email',
            'first_name',
            'last_name',
        ]
