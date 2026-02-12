import math
from django.utils import timezone
from datetime import timedelta
from partners.models import Partner, DeliveryRequest


def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate the great-circle distance between two points on Earth in km."""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def reassign_delivery_request(event, excluded_partner_ids=None):
    if excluded_partner_ids is None:
        excluded_partner_ids = []

    # Also exclude partners who already have requests for this event
    existing_partner_ids = DeliveryRequest.objects.filter(
        event=event
    ).values_list('partner_id', flat=True)
    all_excluded = set(excluded_partner_ids) | set(existing_partner_ids)

    order = event.order
    delivery_lat = getattr(order, 'latitude', None)
    delivery_lng = getattr(order, 'longitude', None)

    if delivery_lat is None or delivery_lng is None:
        print(f"WARNING: Event {event.id} order has no coordinates. Cannot match delivery partner.")
        return None

    # Find active delivery partners with a set location, excluding already-tried ones
    candidates = Partner.objects.filter(
        partner_type='delivery',
        status='active',
        latitude__isnull=False,
        longitude__isnull=False,
    ).exclude(id__in=all_excluded)

    # Find the closest partner within their service radius
    best_partner = None
    best_distance = float('inf')

    for partner in candidates:
        distance = haversine_km(delivery_lat, delivery_lng, partner.latitude, partner.longitude)
        if distance <= partner.service_radius_km and distance < best_distance:
            best_partner = partner
            best_distance = distance

    if not best_partner:
        print(f"WARNING: No available delivery partner for Event {event.id}. Flagging for admin.")
        return None

    expires_at = timezone.make_aware(
        timezone.datetime.combine(event.delivery_date, timezone.datetime.min.time())
    ) - timedelta(hours=48)

    dr = DeliveryRequest.objects.create(
        event=event,
        partner=best_partner,
        first_notified_at=timezone.now(),
        expires_at=expires_at,
    )

    # TODO: Send notification email to partner
    print(f"Reassigned Event {event.id} to Partner {best_partner.id} (DeliveryRequest {dr.id})")
    return dr
