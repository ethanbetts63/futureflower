from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new, fully claimed user account.
    This is now the single entry point for all new user registrations.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    source_partner_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'source_partner_id'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return lower_email

    def validate_source_partner_id(self, value):
        from partners.models import Partner
        try:
            partner = Partner.objects.get(
                id=value, partner_type='delivery', status='active'
            )
        except Partner.DoesNotExist:
            raise serializers.ValidationError("Invalid delivery partner.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        source_partner_id = validated_data.pop('source_partner_id', None)
        email = validated_data.get('email').lower()

        user = User.objects.create_user(
            username=email,
            password=password,
            **validated_data
        )

        if source_partner_id:
            from partners.models import Partner
            try:
                user.source_partner = Partner.objects.get(id=source_partner_id)
                user.save(update_fields=['source_partner'])
            except Partner.DoesNotExist:
                pass

        return user
