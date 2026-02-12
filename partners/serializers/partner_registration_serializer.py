from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from partners.models import Partner, DiscountCode

User = get_user_model()


class PartnerRegistrationSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    # Partner fields
    business_name = serializers.CharField(max_length=255, required=False, default='', allow_blank=True)
    phone = serializers.CharField(max_length=30, required=False, default='', allow_blank=True)
    partner_type = serializers.ChoiceField(
        choices=['non_delivery', 'delivery'],
        default='non_delivery'
    )

    # Delivery partner fields
    street_address = serializers.CharField(max_length=255, required=False, default='', allow_blank=True)
    suburb = serializers.CharField(max_length=100, required=False, default='', allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, default='', allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, default='', allow_blank=True)
    postcode = serializers.CharField(max_length=20, required=False, default='', allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, default='', allow_blank=True)

    # Service area (pin + radius)
    latitude = serializers.FloatField(required=False, allow_null=True, default=None)
    longitude = serializers.FloatField(required=False, allow_null=True, default=None)
    service_radius_km = serializers.IntegerField(required=False, default=10, min_value=1, max_value=250)

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return lower_email

    def validate(self, data):
        if data.get('partner_type') == 'delivery':
            if data.get('latitude') is None or data.get('longitude') is None:
                raise serializers.ValidationError({
                    'latitude': 'Please set your delivery location on the map.'
                })
        return data

    def _generate_booking_slug(self, business_name, first_name, last_name):
        """Generate a unique booking slug from business name, falling back to user name."""
        base = business_name.strip() if business_name else f"{first_name} {last_name}"
        slug = slugify(base)[:80] or 'partner'
        # Ensure uniqueness
        candidate = slug
        counter = 1
        while Partner.objects.filter(booking_slug=candidate).exists():
            candidate = f"{slug}-{counter}"
            counter += 1
        return candidate

    def create(self, validated_data):
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
                'booking_slug': self._generate_booking_slug(
                    validated_data.get('business_name', ''),
                    validated_data['first_name'],
                    validated_data['last_name'],
                ),
                'street_address': validated_data.get('street_address', ''),
                'suburb': validated_data.get('suburb', ''),
                'city': validated_data.get('city', ''),
                'state': validated_data.get('state', ''),
                'postcode': validated_data.get('postcode', ''),
                'country': validated_data.get('country', ''),
                'latitude': validated_data.get('latitude'),
                'longitude': validated_data.get('longitude'),
                'service_radius_km': validated_data.get('service_radius_km', 10),
            })

        partner = Partner.objects.create(**partner_fields)

        # Only create discount code for non-delivery partners
        if validated_data.get('partner_type', 'non_delivery') == 'non_delivery':
            code = DiscountCode.generate_code(validated_data.get('business_name', ''))
            DiscountCode.objects.create(partner=partner, code=code)

        return user
