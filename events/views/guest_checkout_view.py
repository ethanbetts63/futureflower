import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from data_management.models import TermsAcceptance, TermsAndConditions
from events.models import CheckoutSession, OrderBase
from events.serializers import OrderSerializer
from payments.utils.checkout import (
    start_order_payment,
    validate_order_ready_for_payment,
)

User = get_user_model()

CHECKOUT_COOKIE = 'guest_checkout_token'


class GuestCheckoutView(APIView):
    """Guest checkout API. The opaque cookie authorizes exactly one draft order."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def _set_cookie(self, response, token, request):
        get_token(request)
        response.set_cookie(
            CHECKOUT_COOKIE,
            token,
            max_age=int(settings.GUEST_CHECKOUT_LIFETIME.total_seconds()),
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
        )

    def _session(self, request):
        token = request.COOKIES.get(CHECKOUT_COOKIE)
        if not token:
            return None
        try:
            session = CheckoutSession.objects.select_related('order__user').get(
                token_hash=CheckoutSession.hash_token(token)
            )
        except CheckoutSession.DoesNotExist:
            return None
        return None if session.is_expired else session

    def _require_session(self, request):
        session = self._session(request)
        if not session:
            return None, Response({'detail': 'Your checkout session has expired. Please start again.'}, status=410)
        if session.order.status != 'pending_payment':
            return None, Response({'detail': 'This checkout is no longer editable.'}, status=400)
        return session, None

    def post(self, request, action):
        if action == 'start':
            return self.start(request)
        session, error = self._require_session(request)
        if error:
            return error
        if action == 'order':
            return self.update_order(request, session)
        if action == 'claim':
            return self.claim(request, session)
        if action == 'make-recurring':
            return self.make_recurring(request, session)
        if action == 'accept-terms':
            return self.accept_terms(session)
        if action == 'checkout':
            return self.checkout(session)
        return Response({'detail': 'Unknown checkout action.'}, status=404)

    def get(self, request, action):
        session, error = self._require_session(request)
        if error:
            return error
        if action == 'order':
            return Response(OrderSerializer(session.order).data)
        return Response({'detail': 'Unknown checkout action.'}, status=404)

    @transaction.atomic
    def start(self, request):
        existing = self._session(request)
        if existing and existing.order.status == 'pending_payment':
            order = existing.order
        else:
            placeholder = f'guest-{uuid.uuid4()}@checkout.invalid'
            user = User.objects.create_user(username=placeholder, email=placeholder)
            user.set_unusable_password()
            user.save(update_fields=['password'])
            order = OrderBase.objects.create(user=user, billing_mode='one_time')
            _, token = CheckoutSession.create_for_order(order)

        serializer = OrderSerializer(order, data=request.data.get('brief', {}), partial=True)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        response = Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        if not (existing and existing.order.status == 'pending_payment'):
            self._set_cookie(response, token, request)
        return response

    def update_order(self, request, session):
        serializer = OrderSerializer(session.order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(OrderSerializer(serializer.save()).data)

    @transaction.atomic
    def claim(self, request, session):
        email = str(request.data.get('email', '')).strip().lower()
        first_name = str(request.data.get('first_name', '')).strip()
        last_name = str(request.data.get('last_name', '')).strip()
        if not email or not first_name or not last_name:
            return Response({'detail': 'First name, last name, and email are required.'}, status=400)

        current_user = session.order.user
        existing_user = User.objects.filter(email__iexact=email).exclude(pk=current_user.pk).first()
        if existing_user:
            session.order.user = existing_user
            session.order.save(update_fields=['user'])
            current_user.delete()
        else:
            current_user.username = email
            current_user.email = email
            current_user.first_name = first_name
            current_user.last_name = last_name
            current_user.set_unusable_password()
            current_user.save(update_fields=['username', 'email', 'first_name', 'last_name', 'password'])

        session.customer_email = email
        session.save(update_fields=['customer_email', 'updated_at'])
        return Response(OrderSerializer(session.order).data)

    def make_recurring(self, request, session):
        frequency = request.data.get('frequency')
        if frequency not in dict(OrderBase.FREQUENCY_CHOICES):
            return Response({'frequency': 'Choose a valid delivery frequency.'}, status=400)

        order = session.order
        order.make_recurring(frequency, request.data.get('recurring_preferences', ''))
        return Response(OrderSerializer(order).data)

    def accept_terms(self, session):
        latest = TermsAndConditions.objects.filter(terms_type='customer').order_by('-published_at').first()
        if not latest:
            return Response({'detail': 'Customer terms are unavailable.'}, status=404)
        _, created = TermsAcceptance.objects.get_or_create(user=session.order.user, terms=latest)
        return Response({'accepted': True, 'created': created}, status=201 if created else 200)

    def checkout(self, session):
        order = session.order
        if not session.customer_email:
            return Response({'detail': 'Enter your contact details before payment.'}, status=400)

        problem = validate_order_ready_for_payment(order)
        if problem:
            return Response({'detail': problem}, status=400)

        return Response({'clientSecret': start_order_payment(order)})
