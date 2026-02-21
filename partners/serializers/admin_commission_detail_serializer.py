from rest_framework import serializers
from partners.models import Commission


class AdminCommissionDetailSerializer(serializers.ModelSerializer):
    partner_name = serializers.SerializerMethodField()
    partner_id = serializers.IntegerField(source='partner.id', read_only=True)
    partner_type = serializers.CharField(source='partner.partner_type', read_only=True)
    stripe_connect_onboarding_complete = serializers.BooleanField(
        source='partner.stripe_connect_onboarding_complete', read_only=True
    )
    stripe_connect_account_id = serializers.CharField(
        source='partner.stripe_connect_account_id', read_only=True
    )

    class Meta:
        model = Commission
        fields = [
            'id',
            'commission_type',
            'amount',
            'status',
            'note',
            'created_at',
            'event',
            'partner_name',
            'partner_id',
            'partner_type',
            'stripe_connect_onboarding_complete',
            'stripe_connect_account_id',
        ]

    def get_partner_name(self, obj):
        partner = obj.partner
        if partner.business_name:
            return partner.business_name
        return f"{partner.user.first_name} {partner.user.last_name}".strip() or partner.user.email
