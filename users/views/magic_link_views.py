from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.models.magic_link import MagicLink
from users.utils.send_magic_link_email import send_magic_link_email
from users.views.token_views import _set_auth_cookies

User = get_user_model()


class RequestMagicLinkView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).strip().lower()
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user and not user.is_staff and not hasattr(user, 'partner_profile'):
            link, token = MagicLink.create_for(user)
            send_magic_link_email(user, token)
        return Response({'detail': 'If we found an order for that email, we sent a private access link.'})


class ConsumeMagicLinkView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        token = str(request.data.get('token', ''))
        try:
            link = MagicLink.objects.select_for_update().select_related('user', 'order').get(token_hash=MagicLink.hash_token(token))
        except MagicLink.DoesNotExist:
            return Response({'detail': 'This access link is invalid or has expired.'}, status=400)
        if not link.is_valid:
            return Response({'detail': 'This access link is invalid or has expired.'}, status=400)
        link.used_at = timezone.now()
        link.save(update_fields=['used_at'])
        refresh = RefreshToken.for_user(link.user)
        response = Response({'detail': 'Access granted.', 'order_id': link.order_id})
        _set_auth_cookies(response, refresh.access_token, refresh, request=request)
        return response
