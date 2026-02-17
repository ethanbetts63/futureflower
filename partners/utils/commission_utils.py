from decimal import Decimal
from payments.models import Payment
from partners.models import Commission


# Tiered referral commission based on bouquet budget
REFERRAL_COMMISSION_TIERS = [
    (Decimal('100'), Decimal('5')),
    (Decimal('150'), Decimal('10')),
    (Decimal('200'), Decimal('15')),
    (Decimal('250'), Decimal('20')),
]
REFERRAL_COMMISSION_MAX = Decimal('25')


def get_referral_commission_amount(budget):
    """Return the fixed commission amount for a given bouquet budget."""
    for threshold, amount in REFERRAL_COMMISSION_TIERS:
        if budget < threshold:
            return amount
    return REFERRAL_COMMISSION_MAX


def process_referral_commission(payment):
    partner = payment.user.referred_by_partner
    if not partner:
        return

    # Only non-delivery partners earn referral commissions
    if partner.partner_type != 'non_delivery':
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

    commission_amount = get_referral_commission_amount(budget)

    Commission.objects.create(
        partner=partner,
        payment=payment,
        commission_type='referral',
        amount=commission_amount,
        status='pending',
    )
