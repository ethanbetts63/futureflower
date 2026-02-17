from rest_framework import serializers
from partners.models import DiscountCode
from payments.models import Payment


class ValidateDiscountCodeSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30)

    def validate_code(self, value):
        try:
            discount_code = DiscountCode.objects.select_related('partner', 'partner__user').get(code=value)
        except DiscountCode.DoesNotExist:
            raise serializers.ValidationError("This discount code does not exist.")

        if not discount_code.is_active:
            raise serializers.ValidationError("This discount code is no longer active.")

        if discount_code.partner.status != 'active':
            raise serializers.ValidationError("This discount code is not currently valid.")

        user = self.context.get('request').user

        if user.is_authenticated:
            if Payment.objects.filter(user=user, status='succeeded').exists():
                raise serializers.ValidationError("Discount codes are only available for new customers.")

        return value

    def get_discount_info(self):
        code = self.validated_data['code']
        discount_code = DiscountCode.objects.select_related('partner').get(code=code)
        return {
            'code': discount_code.code,
            'discount_amount': str(discount_code.discount_amount),
            'partner_name': discount_code.partner.business_name or 'Partner',
        }
