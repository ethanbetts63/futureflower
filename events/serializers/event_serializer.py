from rest_framework import serializers
from events.models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    Primarily used for read-only operations to display event details.
    """
    class Meta:
        model = Event
        fields = [
            'id',
            'flower_plan',
            'delivery_date',
            'message',
            'bouquet_preference',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'flower_plan',
            'delivery_date',
            'status',
            'created_at',
            'updated_at',
        ]

