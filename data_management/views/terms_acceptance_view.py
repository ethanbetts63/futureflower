from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from data_management.models import TermsAndConditions, TermsAcceptance

VALID_TYPES = {'florist', 'customer', 'affiliate'}


class AcceptTermsView(APIView):
    """
    Records that the authenticated user has accepted the latest version
    of the given terms type.

    POST /api/data/terms/accept/
    Body: { "terms_type": "customer" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        terms_type = request.data.get('terms_type')

        if not terms_type or terms_type not in VALID_TYPES:
            return Response(
                {"detail": f"A valid 'terms_type' is required. Options: {', '.join(sorted(VALID_TYPES))}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        latest = TermsAndConditions.objects.filter(terms_type=terms_type).order_by('-published_at').first()
        if not latest:
            return Response(
                {"detail": f"No terms found for type '{terms_type}'."},
                status=status.HTTP_404_NOT_FOUND,
            )

        _, created = TermsAcceptance.objects.get_or_create(
            user=request.user,
            terms=latest,
        )

        return Response(
            {"accepted": True, "created": created},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
