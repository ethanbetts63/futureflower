import uuid
from decimal import Decimal

import stripe
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
from events.utils.fee_calc import calculate_service_fee
from payments.models import Payment
from payments.utils.checkout import (
    ensure_stripe_customer,
    get_staff_override_amount,
    reuse_or_cancel_pending_payment_intent,
)

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

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
        order.billing_mode = 'recurring'
        order.frequency = frequency
        order.recurring_preferences = request.data.get('recurring_preferences', '')
        order.subscription_message = request.data.get('subscription_message') or (order.draft_card_messages or {}).get('0', '')
        if order.budget:
            order.subtotal = (order.budget + calculate_service_fee(order.budget)).quantize(Decimal('0.01'))
        order.save()
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
        if order.total_amount is None or order.total_amount <= 0:
            return Response({'detail': 'Order amount must be greater than zero.'}, status=400)
        if order.billing_mode == 'recurring' and not all([order.start_date, order.frequency]):
            return Response({'detail': 'Subscription details are incomplete.'}, status=400)

        user = order.user
        ensure_stripe_customer(user)
        final_amount = get_staff_override_amount(user, Decimal(order.total_amount))
        amount_in_cents = int(max(final_amount, Decimal('0.50')) * 100)
        reused_secret = reuse_or_cancel_pending_payment_intent(order, amount_in_cents)
        if reused_secret:
            return Response({'clientSecret': reused_secret})

        metadata = {'order_id': str(order.id), 'billing_mode': order.billing_mode}
        if order.discount_code:
            metadata['discount_code'] = order.discount_code.code
        kwargs = {
            'amount': amount_in_cents,
            'currency': order.currency.lower(),
            'customer': user.stripe_customer_id,
            'automatic_payment_methods': {'enabled': True},
            'metadata': metadata,
        }
        if order.billing_mode == 'recurring':
            kwargs['setup_future_usage'] = 'off_session'
        payment_intent = stripe.PaymentIntent.create(**kwargs)
        Payment.objects.create(
            user=user, order=order, stripe_payment_intent_id=payment_intent.id,
            amount=final_amount, status='pending',
        )
        return Response({'clientSecret': payment_intent.client_secret})
