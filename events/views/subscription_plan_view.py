from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from events.models import SubscriptionPlan
from events.serializers import SubscriptionPlanSerializer

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Subscription Plans.
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensures that users can only see their own subscription plans.
        """
        return self.queryset.filter(user=self.request.user)

    def get_serializer_context(self):
        """
        Pass request context to the serializer.
        """
        return {'request': self.request}

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
        Calculates the price per delivery for a subscription plan based on a given budget.
        """
        plan = self.get_object()
        budget = request.data.get('budget')

        if budget is None:
            return Response({'error': 'Budget is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            budget = float(budget)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid budget format.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fee is 5% or $15 minimum
        fee = max(budget * 0.05, 15.0)
        price_per_delivery = budget + fee

        return Response({'price_per_delivery': price_per_delivery}, status=status.HTTP_200_OK)
