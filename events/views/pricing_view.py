from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from data_management.utils.pricing_calculators import forever_flower_upfront_price

@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_upfront_price(request):
    """
    Calculates the upfront price for a Forever Flower subscription based on user inputs.
    """
    try:
        bouquet_budget = float(request.data.get('bouquet_budget'))
        deliveries_per_year = int(request.data.get('deliveries_per_year'))
        years = int(request.data.get('years'))
    except (TypeError, ValueError, AttributeError):
        return Response(
            {'error': 'Invalid input. Please provide valid numbers for all fields.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not all([bouquet_budget, deliveries_per_year, years]):
        return Response(
            {'error': 'Missing one or more required fields: bouquet_budget, deliveries_per_year, years.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validation for ranges, as specified in the frontend requirement
    if not (1 <= deliveries_per_year <= 12):
        return Response(
            {'error': 'Deliveries per year must be between 1 and 12.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if not (1 <= years <= 25):
        return Response(
            {'error': 'Years must be between 1 and 25.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if not (bouquet_budget > 0):
        return Response(
            {'error': 'Bouquet budget must be greater than 0.'},
            status=status.HTTP_400_BAD_REQUEST
        )


    upfront_price, breakdown = forever_flower_upfront_price(
        bouquet_budget=bouquet_budget,
        deliveries_per_year=deliveries_per_year,
        years=years,
    )

    response_data = {
        'upfront_price': upfront_price,
        'breakdown': breakdown
    }

    return Response(response_data, status=status.HTTP_200_OK)
