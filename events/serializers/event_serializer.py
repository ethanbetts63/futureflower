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
            'order',
            'delivery_date',
            'message',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'order',
            'delivery_date',
            'status',
            'created_at',
            'updated_at',
        ]

