from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from events.models import OrderBase

User = get_user_model()

START_URL = '/api/events/guest-checkout/start/'
CLAIM_URL = '/api/events/guest-checkout/claim/'


def start_order(client, budget='125.00'):
    response = client.post(START_URL, {'brief': {'budget': budget}}, format='json')
    assert response.status_code == 201, response.data
    return OrderBase.objects.get(pk=response.data['id'])


@pytest.mark.django_db
class TestGuestCheckoutClaim:
    def test_claim_records_the_customer_details_on_the_order(self):
        client = APIClient()
        order = start_order(client)

        response = client.post(
            CLAIM_URL,
            {'email': 'Buyer@Example.com', 'first_name': 'Bo', 'last_name': 'Buyer'},
            format='json',
        )

        assert response.status_code == 200, response.data
        order.refresh_from_db()
        assert order.user.email == 'buyer@example.com'
        assert order.user.first_name == 'Bo'
        assert order.user.last_name == 'Buyer'

    def test_claiming_someone_elses_email_does_not_take_over_their_account(self):
        """
        The email is never verified. Resolving it against existing accounts used to
        hand the order to whoever held the address, which put this customer's
        payment on their Stripe customer and their terms acceptance on the wrong
        person. A staff address additionally billed the order at $1 via the (now
        removed) staff override.
        """
        staff = User.objects.create_user(
            username='boss', email='boss@futureflower.app', is_staff=True
        )

        client = APIClient()
        order = start_order(client, budget='125.00')
        placeholder_user_id = order.user_id

        response = client.post(
            CLAIM_URL,
            {'email': 'boss@futureflower.app', 'first_name': 'Not', 'last_name': 'Boss'},
            format='json',
        )
        assert response.status_code == 200, response.data

        order.refresh_from_db()
        assert order.user_id == placeholder_user_id
        assert order.user_id != staff.pk
        assert not order.user.is_staff
        assert order.total_amount == Decimal('125.00')

    def test_two_orders_may_share_an_email_without_colliding(self):
        """
        `username` must stay the opaque placeholder. Setting it to the email is
        what made a second order with the same address collide, which is why the
        account-takeover lookup existed.
        """
        first_client = APIClient()
        first_order = start_order(first_client)
        response = first_client.post(
            CLAIM_URL,
            {'email': 'repeat@example.com', 'first_name': 'Reg', 'last_name': 'Ular'},
            format='json',
        )
        assert response.status_code == 200, response.data

        second_client = APIClient()
        second_order = start_order(second_client)
        response = second_client.post(
            CLAIM_URL,
            {'email': 'repeat@example.com', 'first_name': 'Reg', 'last_name': 'Ular'},
            format='json',
        )
        assert response.status_code == 200, response.data

        first_order.refresh_from_db()
        second_order.refresh_from_db()
        assert first_order.pk != second_order.pk
        assert first_order.user_id != second_order.user_id
        assert first_order.user.email == second_order.user.email == 'repeat@example.com'
