import logging
from rest_framework.permissions import AllowAny
from django.core.signing import Signer, BadSignature
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import BlockedEmail

logger = logging.getLogger(__name__)

signer = Signer()

class AddToBlocklistView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, signed_email, *args, **kwargs):
        try:
            email = signer.unsign(signed_email)
        except BadSignature:
            return Response(
                {"detail": "Invalid block link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        blocked_email, created = BlockedEmail.objects.get_or_create(email=email)

        if created:
            logger.info("Email '%s' has been added to the blocklist.", email)

        return redirect(f"{settings.SITE_URL}/blocklist-success/")
