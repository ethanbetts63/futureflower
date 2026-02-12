import math
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from events.models import Event
from partners.models import Partner, DeliveryRequest
from partners.utils.reassignment import reassign_delivery_request, haversine_km


class Command(BaseCommand):
    help = 'Process delivery notifications: create requests, send reminders, handle expirations'

    def handle(self, *args, **options):
        now = timezone.now()
        today = now.date()

        # 1. 14 days before delivery: Create new DeliveryRequests
        target_date_14 = today + timedelta(days=14)
        events_needing_request = Event.objects.filter(
            delivery_date=target_date_14,
            status='scheduled',
        ).exclude(
            delivery_requests__isnull=False
        ).select_related('order')

        for event in events_needing_request:
            order = event.order
            user = order.user

            delivery_lat = getattr(order, 'latitude', None)
            delivery_lng = getattr(order, 'longitude', None)

            if delivery_lat is None or delivery_lng is None:
                self.stdout.write(self.style.WARNING(
                    f"Event {event.id} order has no coordinates. Skipping."
                ))
                continue

            # Determine partner: user's source_partner if within radius, else closest match
            chosen_partner = None

            source_partner = getattr(user, 'source_partner', None)
            if (source_partner and source_partner.partner_type == 'delivery'
                    and source_partner.status == 'active'
                    and source_partner.latitude is not None
                    and source_partner.longitude is not None):
                distance = haversine_km(
                    delivery_lat, delivery_lng,
                    source_partner.latitude, source_partner.longitude
                )
                if distance <= source_partner.service_radius_km:
                    chosen_partner = source_partner

            if not chosen_partner:
                # Geographic match: find closest partner within their radius
                candidates = Partner.objects.filter(
                    partner_type='delivery',
                    status='active',
                    latitude__isnull=False,
                    longitude__isnull=False,
                )
                best_distance = float('inf')
                for partner in candidates:
                    distance = haversine_km(
                        delivery_lat, delivery_lng,
                        partner.latitude, partner.longitude
                    )
                    if distance <= partner.service_radius_km and distance < best_distance:
                        chosen_partner = partner
                        best_distance = distance

            if not chosen_partner:
                self.stdout.write(self.style.WARNING(
                    f"No delivery partner found for Event {event.id}. Flagging for admin."
                ))
                continue

            expires_at = timezone.make_aware(
                timezone.datetime.combine(event.delivery_date, timezone.datetime.min.time())
            ) - timedelta(hours=48)

            dr = DeliveryRequest.objects.create(
                event=event,
                partner=chosen_partner,
                first_notified_at=now,
                expires_at=expires_at,
            )
            # TODO: Send email notification
            self.stdout.write(self.style.SUCCESS(
                f"Created DeliveryRequest {dr.id} for Event {event.id} → Partner {chosen_partner.id}"
            ))

        # 2. 7 days before: Send second notification
        target_date_7 = today + timedelta(days=7)
        pending_requests_7 = DeliveryRequest.objects.filter(
            status='pending',
            event__delivery_date=target_date_7,
            first_notified_at__isnull=False,
            second_notified_at__isnull=True,
        )

        for dr in pending_requests_7:
            dr.second_notified_at = now
            dr.save()
            # TODO: Send second email notification
            self.stdout.write(self.style.SUCCESS(
                f"Sent second notification for DeliveryRequest {dr.id}"
            ))

        # 3. Expired: Handle expired requests
        expired_requests = DeliveryRequest.objects.filter(
            status='pending',
            expires_at__lt=now,
        )

        for dr in expired_requests:
            dr.status = 'expired'
            dr.save()
            self.stdout.write(self.style.WARNING(
                f"DeliveryRequest {dr.id} expired. Triggering reassignment."
            ))
            reassign_delivery_request(dr.event, excluded_partner_ids=[dr.partner_id])

        self.stdout.write(self.style.SUCCESS('Delivery notifications processed successfully.'))
