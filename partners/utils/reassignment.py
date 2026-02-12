from django.utils import timezone
from datetime import timedelta
from partners.models import Partner, DeliveryRequest, ServiceArea


def reassign_delivery_request(event, excluded_partner_ids=None):
    if excluded_partner_ids is None:
        excluded_partner_ids = []

    # Also exclude partners who already have requests for this event
    existing_partner_ids = DeliveryRequest.objects.filter(
        event=event
    ).values_list('partner_id', flat=True)
    all_excluded = set(excluded_partner_ids) | set(existing_partner_ids)

    order = event.order
    recipient_suburb = getattr(order, 'suburb', '')
    recipient_city = getattr(order, 'city', '')
    recipient_country = getattr(order, 'country', '')

    # Find delivery partners with matching service areas
    matching_partners = Partner.objects.filter(
        partner_type='delivery',
        status='active',
        service_areas__suburb__iexact=recipient_suburb,
        service_areas__city__iexact=recipient_city,
        service_areas__country__iexact=recipient_country,
        service_areas__is_active=True,
    ).exclude(id__in=all_excluded).distinct()

    partner = matching_partners.first()

    if not partner:
        print(f"WARNING: No available delivery partner for Event {event.id}. Flagging for admin.")
        return None

    expires_at = timezone.make_aware(
        timezone.datetime.combine(event.delivery_date, timezone.datetime.min.time())
    ) - timedelta(hours=48)

    dr = DeliveryRequest.objects.create(
        event=event,
        partner=partner,
        first_notified_at=timezone.now(),
        expires_at=expires_at,
    )

    # TODO: Send notification email to partner
    print(f"Reassigned Event {event.id} to Partner {partner.id} (DeliveryRequest {dr.id})")
    return dr
