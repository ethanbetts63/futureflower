from rest_framework import serializers
from events.models import Event

class EventSerializer(serializers.ModelSerializer):
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

