from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from events.utils.pricing_calculators import forever_flower_upfront_price

@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_upfront_price(request):
    """
    Calculates the upfront price for a Forever Flower subscription based on user inputs.
    """
    try:
        budget = float(request.data.get('budget'))
        deliveries_per_year = int(request.data.get('deliveries_per_year'))
        years = int(request.data.get('years'))
    except (TypeError, ValueError, AttributeError):
        return Response(
            {'error': 'Invalid input. Please provide valid numbers for all fields.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not all([budget, deliveries_per_year, years]):
        return Response(
            {'error': 'Missing one or more required fields: budget, deliveries_per_year, years.'},
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
    if not (budget > 0):
        return Response(
            {'error': 'Bouquet budget must be greater than 0.'},
            status=status.HTTP_400_BAD_REQUEST
        )


    upfront_price, breakdown = forever_flower_upfront_price(
        bouquet_budget=budget,
        deliveries_per_year=deliveries_per_year,
        years=years,
    )

    # Formatted print for debugging in the terminal
    print("\n--- Forever Flower Price Calculation ---")
    print(f"Inputs:")
    print(f"  - Bouquet Budget: ${budget}")
    print(f"  - Deliveries per Year: {deliveries_per_year}")
    print(f"  - Years: {years}")
    print("-" * 38)
    print("Breakdown:")
    for key, value in breakdown.items():
        print(f"  - {key.replace('_', ' ').title()}: {value}")
    print("-" * 38)
    print(f"Calculated Upfront Price: ${upfront_price}")
    print("--- End Calculation ---\n")

    response_data = {
        'upfront_price': upfront_price,
        'breakdown': breakdown
    }

    return Response(response_data, status=status.HTTP_200_OK)
