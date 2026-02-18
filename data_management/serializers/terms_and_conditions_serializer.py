from rest_framework import serializers
from data_management.models import TermsAndConditions

class TermsAndConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsAndConditions
        fields = ['terms_type', 'version', 'content', 'published_at']
