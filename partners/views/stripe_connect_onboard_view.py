import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from partners.models import Partner

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeConnectOnboardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response({"error": "Not a partner."}, status=status.HTTP_404_NOT_FOUND)

        # Fallback: create account if registration didn't create it (e.g. Stripe was down)
        if not partner.stripe_connect_account_id:
            account = stripe.Account.create(
                type='express',
                email=request.user.email,
                metadata={'partner_id': partner.id},
            )
            partner.stripe_connect_account_id = account.id
            partner.save()

        # Create an AccountSession for the embedded onboarding component
        session = stripe.AccountSession.create(
            account=partner.stripe_connect_account_id,
            components={"account_onboarding": {"enabled": True}},
        )

        return Response({'client_secret': session.client_secret})
