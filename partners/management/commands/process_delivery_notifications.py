from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from events.models import Event
from partners.models import Partner, DeliveryRequest, ServiceArea
from partners.utils.reassignment import reassign_delivery_request


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

            # Determine partner: user's source_partner if covers area, else geographic match
            chosen_partner = None

            source_partner = getattr(user, 'source_partner', None)
            if source_partner and source_partner.partner_type == 'delivery' and source_partner.status == 'active':
                covers_area = ServiceArea.objects.filter(
                    partner=source_partner,
                    suburb__iexact=getattr(order, 'suburb', ''),
                    city__iexact=getattr(order, 'city', ''),
                    country__iexact=getattr(order, 'country', ''),
                    is_active=True,
                ).exists()
                if covers_area:
                    chosen_partner = source_partner

            if not chosen_partner:
                # Geographic match
                chosen_partner = Partner.objects.filter(
                    partner_type='delivery',
                    status='active',
                    service_areas__suburb__iexact=getattr(order, 'suburb', ''),
                    service_areas__city__iexact=getattr(order, 'city', ''),
                    service_areas__country__iexact=getattr(order, 'country', ''),
                    service_areas__is_active=True,
                ).distinct().first()

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
