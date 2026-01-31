# events/serializers/single_delivery_plan_serializer.py
from rest_framework import serializers
from events.models import SingleDeliveryPlan

class SingleDeliveryPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleDeliveryPlan
        fields = '__all__' 
        read_only_fields = ('id', 'user', 'status', 'created_at', 'updated_at')
