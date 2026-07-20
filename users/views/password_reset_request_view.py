import logging
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from users.models import User
from users.utils.send_password_reset_email import send_password_reset_email
from users.serializers.password_reset_request_serializer import EmailSerializer

logger = logging.getLogger(__name__)

class PasswordResetRequestView(APIView):
    """
    Allows a user to request a password reset email.
    This view is public and includes rate limiting.
    """
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        """
        Sends a password reset email if the user exists.
        Always returns a success response to prevent user enumeration.
        """
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"detail": "If an account with this email exists, a password reset link has been sent."},
                status=status.HTTP_200_OK
            )

        email = serializer.validated_data.get('email')
        
        try:
            user = User.objects.get(email__iexact=email, is_active=True)
            if not (user.is_staff or user.is_superuser or hasattr(user, 'partner_profile')):
                return Response(
                    {"detail": "If an account with this email exists, a password reset link has been sent."},
                    status=status.HTTP_200_OK,
                )
            
            if user.password_reset_last_sent_at:
                time_since_last_send = timezone.now() - user.password_reset_last_sent_at
                if time_since_last_send < timedelta(seconds=60):
                    return Response(
                        {"detail": "If an account with this email exists, a password reset link has been sent."},
                        status=status.HTTP_200_OK
                    )
            
            was_sent = send_password_reset_email(user)
            
            if was_sent:
                user.password_reset_last_sent_at = timezone.now()
                user.save(update_fields=['password_reset_last_sent_at'])
                
        except User.DoesNotExist:
            pass
        except Exception as e:
            logger.error("Unexpected error during password reset request: %s", e)
            pass

        return Response(
            {"detail": "If an account with this email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK
        )
