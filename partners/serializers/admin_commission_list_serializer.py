from rest_framework import serializers
from partners.models import Commission


class AdminCommissionListSerializer(serializers.ModelSerializer):
    partner_name = serializers.SerializerMethodField()
    partner_id = serializers.IntegerField(source='partner.id', read_only=True)
    partner_type = serializers.CharField(source='partner.partner_type', read_only=True)

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
        ]

    def get_partner_name(self, obj):
        partner = obj.partner
        if partner.business_name:
            return partner.business_name
        return f"{partner.user.first_name} {partner.user.last_name}".strip() or partner.user.email
