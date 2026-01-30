from decimal import Decimal, InvalidOperation
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from events.utils.upfront_price_calc import forever_flower_upfront_price

class PublicPriceCalculatorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        budget = request.data.get('budget')
        deliveries_per_year = request.data.get('deliveries_per_year')
        years = request.data.get('years')

        # Basic validation
        if not all([budget, deliveries_per_year, years]):
            return Response(
                {"error": "Missing one or more required parameters: budget, deliveries_per_year, years."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            budget = Decimal(budget)
            deliveries_per_year = int(deliveries_per_year)
            years = int(years)
        except (InvalidOperation, TypeError):
            return Response(
                {"error": "Invalid parameter types. Budget must be a number, others integers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if budget <= 0 or deliveries_per_year <= 0 or years <= 0:
             return Response(
                {"error": "Parameters must be positive."},
                status=status.HTTP_400_BAD_REQUEST
            )

        upfront_price, breakdown = forever_flower_upfront_price(
            budget=budget,
            deliveries_per_year=deliveries_per_year,
            years=years
        )

        return Response({
            "upfront_price": upfront_price,
            "breakdown": breakdown
        }, status=status.HTTP_200_OK)
