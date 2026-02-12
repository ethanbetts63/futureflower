from decimal import Decimal
from payments.models import Payment
from partners.models import Commission


def process_referral_commission(payment):
    partner = payment.user.referred_by_partner
    if not partner:
        return

    succeeded_count = Payment.objects.filter(
        user=payment.user, status='succeeded'
    ).count()
    if succeeded_count > 3:
        return

    order = payment.order
    budget = getattr(order, 'budget', None)
    if not budget:
        return

    Commission.objects.create(
        partner=partner,
        payment=payment,
        commission_type='referral',
        amount=budget * Decimal('0.05'),
        status='pending',
    )
