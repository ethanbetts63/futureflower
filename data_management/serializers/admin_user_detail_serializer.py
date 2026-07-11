from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminUserDetailSerializer(serializers.ModelSerializer):
    is_partner = serializers.SerializerMethodField()
    referred_by = serializers.SerializerMethodField()
    plans = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'is_superuser',
            'is_active',
            'date_joined',
            'stripe_customer_id',
            'anonymized_at',
            'is_partner',
            'referred_by',
            'plans',
        ]

    def get_is_partner(self, obj):
        return hasattr(obj, 'partner_profile')

    def get_referred_by(self, obj):
        if not obj.referred_by_partner:
            return None
        p = obj.referred_by_partner
        return p.business_name or f"{p.user.first_name} {p.user.last_name}".strip()

    def get_plans(self, obj):
        from events.models import OrderBase
        orders = list(
            OrderBase.objects.filter(user=obj).order_by('-created_at').values(
                'id', 'status', 'total_amount', 'created_at',
                'recipient_first_name', 'recipient_last_name', 'billing_mode',
            )
        )
        for o in orders:
            o['plan_type'] = o.pop('billing_mode')
            o['total_amount'] = str(o['total_amount']) if o['total_amount'] is not None else None
            o['created_at'] = o['created_at'].isoformat()
        return orders
