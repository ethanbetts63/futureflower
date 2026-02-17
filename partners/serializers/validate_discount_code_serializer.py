from rest_framework import serializers
from partners.models import DiscountCode
from payments.models import Payment
from events.models import UpfrontPlan, SubscriptionPlan


class ValidateDiscountCodeSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30, required=False, allow_blank=True)
    plan_id = serializers.IntegerField()
    plan_type = serializers.ChoiceField(choices=['upfront', 'subscription'])

    def _get_plan(self):
        plan_id = self.validated_data['plan_id']
        plan_type = self.validated_data['plan_type']
        user = self.context['request'].user

        Model = UpfrontPlan if plan_type == 'upfront' else SubscriptionPlan
        try:
            return Model.objects.get(pk=plan_id, user=user)
        except Model.DoesNotExist:
            raise serializers.ValidationError("Plan not found.")

    def validate_code(self, value):
        if not value:
            return value

        try:
            discount_code = DiscountCode.objects.select_related('partner', 'partner__user').get(code=value)
        except DiscountCode.DoesNotExist:
            raise serializers.ValidationError("This discount code does not exist.")

        if not discount_code.is_active:
            raise serializers.ValidationError("This discount code is no longer active.")

        if discount_code.partner.status != 'active':
            raise serializers.ValidationError("This discount code is not currently valid.")

        user = self.context.get('request').user

        if user == discount_code.partner.user:
            raise serializers.ValidationError("You cannot use your own discount code.")

        if Payment.objects.filter(user=user, status='succeeded').exists():
            raise serializers.ValidationError("Discount codes are only available for new customers.")

        return value

    def apply_discount(self):
        code = self.validated_data.get('code', '')
        plan = self._get_plan()
        user = self.context['request'].user

        if not code:
            # Clear discount from plan
            plan.discount_code = None
            plan.discount_amount = 0
            plan.save()
            return {
                'code': None,
                'discount_amount': '0.00',
                'partner_name': None,
                'new_total_amount': str(plan.total_amount),
            }

        discount_code = DiscountCode.objects.select_related('partner').get(code=code)

        plan.discount_code = discount_code
        plan.discount_amount = discount_code.discount_amount
        plan.save()

        # Set referred_by_partner if not already set
        if not user.referred_by_partner:
            user.referred_by_partner = discount_code.partner
            user.save(update_fields=['referred_by_partner'])

        return {
            'code': discount_code.code,
            'discount_amount': str(discount_code.discount_amount),
            'partner_name': discount_code.partner.business_name or 'Partner',
            'new_total_amount': str(plan.total_amount),
        }
