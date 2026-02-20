from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Q
from events.models import UpfrontPlan, SubscriptionPlan
from data_management.serializers.admin_plan_serializer import AdminPlanSerializer


class AdminPlanListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get('status', '').strip()
        plan_type_filter = request.query_params.get('plan_type', '').strip()
        search = request.query_params.get('search', '').strip()

        upfront_qs = UpfrontPlan.objects.select_related('user')
        subscription_qs = SubscriptionPlan.objects.select_related('user')

        if status_filter:
            upfront_qs = upfront_qs.filter(status=status_filter)
            subscription_qs = subscription_qs.filter(status=status_filter)

        if search:
            q = (
                Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(user__email__icontains=search)
                | Q(recipient_first_name__icontains=search)
                | Q(recipient_last_name__icontains=search)
            )
            upfront_qs = upfront_qs.filter(q)
            subscription_qs = subscription_qs.filter(q)

        if plan_type_filter == 'upfront':
            plans = list(upfront_qs.order_by('-created_at'))
        elif plan_type_filter == 'subscription':
            plans = list(subscription_qs.order_by('-created_at'))
        else:
            plans = sorted(
                list(upfront_qs) + list(subscription_qs),
                key=lambda p: p.created_at,
                reverse=True,
            )

        return Response(AdminPlanSerializer(plans, many=True).data)
