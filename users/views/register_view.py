from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers.register_serializer import RegisterSerializer
from users.views.token_views import _set_auth_cookies


class RegisterView(APIView):
    """
    API view for all new user registrations.
    Accepts user profile data and a password, creates a new claimed user,
    and sets JWT tokens as HttpOnly cookies for immediate login.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)

        response = Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_201_CREATED)

        _set_auth_cookies(response, refresh.access_token, refresh)
        return response
