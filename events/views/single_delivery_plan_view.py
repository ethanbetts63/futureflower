# foreverflower/events/views/single_delivery_plan_view.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal, InvalidOperation
from ..models import SingleDeliveryPlan
from ..serializers.single_delivery_plan_serializer import SingleDeliveryPlanSerializer
from events.utils.fee_calc import calculate_service_fee

class SingleDeliveryPlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows single delivery plans to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SingleDeliveryPlanSerializer

    def get_queryset(self):
        """
        This view should only return plans that belong to the
        currently authenticated user.
        """
        return SingleDeliveryPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Associate the plan with the logged-in user upon creation.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='get-or-create-pending')
    def get_or_create_pending(self, request):
        """
        Retrieves an existing pending_payment plan or creates a new one for the user.
        This is designed to be robust against multiple pending plans existing for a user.
        """
        # Fetch all pending plans for the user, most recent first.
        pending_plans = SingleDeliveryPlan.objects.filter(user=request.user, status='pending_payment').order_by('-created_at')

        if pending_plans.exists():
            pending_plan = pending_plans.first()
        else:
            # Or create a new one if none exist.
            pending_plan = SingleDeliveryPlan.objects.create(user=request.user, status='pending_payment')

        serializer = self.get_serializer(pending_plan)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='calculate-price')
    def calculate_price(self, request, pk=None):
        """
        Calculates the total price for a single delivery plan based on a budget.
        """
        try:
            budget_str = request.data.get('budget')
            if budget_str is None:
                return Response({'error': 'Budget is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            budget = Decimal(budget_str)
            if budget <= 0:
                return Response({'error': 'Budget must be a positive number.'}, status=status.HTTP_400_BAD_REQUEST)

        except (InvalidOperation, TypeError, ValueError):
            return Response(
                {'error': 'Invalid budget format. Please provide a valid number.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        fee = calculate_service_fee(budget)
        total_amount = budget + fee

        return Response({'total_amount': total_amount}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        Custom partial_update to include server-side validation for total_amount.
        """
        if 'total_amount' in request.data:
            try:
                client_provided_total = Decimal(str(request.data['total_amount']))
                budget = Decimal(str(request.data.get('budget')))
            except (InvalidOperation, TypeError, ValueError):
                return Response(
                    {"error": "Invalid data type for total_amount or budget."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Recalculate on the server
            fee = calculate_service_fee(budget)
            server_calculated_total = budget + fee

            # Compare with a small tolerance
            if not abs(server_calculated_total - client_provided_total) < Decimal('0.02'):
                return Response(
                    {"error": f"Price mismatch. Server calculated: {server_calculated_total}, Client provided: {client_provided_total}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return super().partial_update(request, *args, **kwargs)
