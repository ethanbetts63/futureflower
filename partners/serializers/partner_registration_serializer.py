from rest_framework import serializers
from django.contrib.auth import get_user_model
from partners.models import Partner, DiscountCode, ServiceArea

User = get_user_model()


class ServiceAreaSerializer(serializers.Serializer):
    suburb = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, default='')
    postcode = serializers.CharField(max_length=20, required=False, default='')
    country = serializers.CharField(max_length=100)


class PartnerRegistrationSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    # Partner fields
    business_name = serializers.CharField(max_length=255, required=False, default='')
    phone = serializers.CharField(max_length=30, required=False, default='')
    partner_type = serializers.ChoiceField(
        choices=['non_delivery', 'delivery'],
        default='non_delivery'
    )

    # Delivery partner fields (Phase 2)
    booking_slug = serializers.SlugField(max_length=100, required=False)
    street_address = serializers.CharField(max_length=255, required=False, default='')
    suburb = serializers.CharField(max_length=100, required=False, default='')
    city = serializers.CharField(max_length=100, required=False, default='')
    state = serializers.CharField(max_length=100, required=False, default='')
    postcode = serializers.CharField(max_length=20, required=False, default='')
    country = serializers.CharField(max_length=100, required=False, default='')
    service_areas = ServiceAreaSerializer(many=True, required=False, default=[])

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return lower_email

    def validate_booking_slug(self, value):
        if value and Partner.objects.filter(booking_slug=value).exists():
            raise serializers.ValidationError("This booking slug is already taken.")
        return value

    def validate(self, data):
        if data.get('partner_type') == 'delivery':
            if not data.get('booking_slug'):
                raise serializers.ValidationError({
                    'booking_slug': 'Booking slug is required for delivery partners.'
                })
        return data

    def create(self, validated_data):
        service_areas_data = validated_data.pop('service_areas', [])
        email = validated_data['email'].lower()

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        partner_fields = {
            'user': user,
            'partner_type': validated_data.get('partner_type', 'non_delivery'),
            'business_name': validated_data.get('business_name', ''),
            'phone': validated_data.get('phone', ''),
        }

        if validated_data.get('partner_type') == 'delivery':
            partner_fields.update({
                'booking_slug': validated_data.get('booking_slug'),
                'street_address': validated_data.get('street_address', ''),
                'suburb': validated_data.get('suburb', ''),
                'city': validated_data.get('city', ''),
                'state': validated_data.get('state', ''),
                'postcode': validated_data.get('postcode', ''),
                'country': validated_data.get('country', ''),
            })

        partner = Partner.objects.create(**partner_fields)

        # Only create discount code for non-delivery partners
        if validated_data.get('partner_type', 'non_delivery') == 'non_delivery':
            code = DiscountCode.generate_code(validated_data.get('business_name', ''))
            DiscountCode.objects.create(partner=partner, code=code)

        # Create service areas for delivery partners
        for area_data in service_areas_data:
            ServiceArea.objects.create(partner=partner, **area_data)

        return user
