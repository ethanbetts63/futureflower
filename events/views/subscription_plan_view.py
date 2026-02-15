from decimal import Decimal, InvalidOperation
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from events.models import SubscriptionPlan
from events.serializers import SubscriptionPlanSerializer
from events.utils.fee_calc import calculate_service_fee

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Subscription Plans.
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]

    def _calculate_total_amount(self, budget: Decimal) -> Decimal:
        """
        Calculates the total amount (budget + fee) per delivery for a subscription plan.
        """
        fee = calculate_service_fee(budget)
        total_amount = budget + fee

        return total_amount.quantize(Decimal('0.01'))

    def get_queryset(self):
        """
        Ensures that users can only see their own subscription plans.
        """
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='get-or-create-pending')
    def get_or_create_pending(self, request):
        """
        Gets an existing pending subscription plan for the user, or creates one if none exists.
        A user should only have one pending plan at a time.
        """
        plan, created = SubscriptionPlan.objects.get_or_create(
            user=request.user,
            status='pending_payment'
        )
        serializer = self.get_serializer(plan)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    @action(detail=True, methods=['post'], url_path='calculate-price')
    def calculate_price(self, request, pk=None):
        """
        Calculates the total amount per delivery for a subscription plan based on a given budget.
        """
        budget_str = request.data.get('budget')

        if budget_str is None:
            return Response({'error': 'Budget is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            budget = Decimal(budget_str)
        except (InvalidOperation, TypeError):
            return Response({'error': 'Invalid budget format.'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = self._calculate_total_amount(budget)

        return Response({'total_amount': total_amount}, status=status.HTTP_200_OK)
