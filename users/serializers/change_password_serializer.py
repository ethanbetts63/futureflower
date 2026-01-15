# users/serializers/change_password_serializer.py
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import update_session_auth_hash

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        """
        Check that the old password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Your old password was entered incorrectly. Please enter it again.")
        return value

    def validate(self, data):
        """
        Check that the two new password entries match and validate password strength.
        """
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "The two password fields didn't match."})
        
        # Run the new password against Django's password validators
        try:
            validate_password(data['new_password'], self.context['request'].user)
        except DjangoValidationError as e:
            # Catch the correct exception and raise a DRF ValidationError
            # with the error message nested under the correct field.
            raise serializers.ValidationError({'new_password': list(e.messages)})

        return data

    def save(self, **kwargs):
        """
        Save the new password.
        """
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # This is important to keep the user logged in after a password change if using sessions.
        # While we are using JWT, this is a good practice to keep.
        update_session_auth_hash(self.context['request'], user)