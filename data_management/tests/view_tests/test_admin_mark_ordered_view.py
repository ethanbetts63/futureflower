import pytest
from django.utils import timezone
from rest_framework.test import APIClient
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from users.tests.factories.user_factory import UserFactory
from data_management.models import Notification


@pytest.mark.django_db
class TestAdminMarkOrderedView:
    def setup_method(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def _url(self, pk):
        return f'/api/data/admin/events/{pk}/mark-ordered/'

    def _payload(self, **kwargs):
        return {'ordered_at': timezone.now().isoformat(), **kwargs}

    def test_marks_event_as_ordered(self):
        event = EventFactory(status='scheduled')
        response = self.client.post(self._url(event.pk), self._payload(), format='json')
        assert response.status_code == 200
        event.refresh_from_db()
        assert event.status == 'ordered'

    def test_saves_ordered_at_timestamp(self):
        event = EventFactory(status='scheduled')
        self.client.post(self._url(event.pk), self._payload(), format='json')
        event.refresh_from_db()
        assert event.ordered_at is not None

    def test_saves_ordering_evidence_text(self):
        event = EventFactory(status='scheduled')
        self.client.post(self._url(event.pk), self._payload(ordering_evidence_text='Receipt #123'), format='json')
        event.refresh_from_db()
        assert event.ordering_evidence_text == 'Receipt #123'

    def test_cancels_pending_notifications(self):
        plan = UpfrontPlanFactory()
        event = EventFactory(status='scheduled', order=plan)
        notif = Notification.objects.create(
            recipient_type='admin',
            channel='sms',
            body='Reminder',
            scheduled_for=event.delivery_date,
            status='pending',
            related_event=event,
        )
        self.client.post(self._url(event.pk), self._payload(), format='json')
        notif.refresh_from_db()
        assert notif.status == 'cancelled'

    def test_does_not_cancel_sent_notifications(self):
        plan = UpfrontPlanFactory()
        event = EventFactory(status='scheduled', order=plan)
        notif = Notification.objects.create(
            recipient_type='admin',
            channel='sms',
            body='Already sent',
            scheduled_for=event.delivery_date,
            status='sent',
            related_event=event,
        )
        self.client.post(self._url(event.pk), self._payload(), format='json')
        notif.refresh_from_db()
        assert notif.status == 'sent'

    def test_400_if_ordered_at_missing(self):
        event = EventFactory(status='scheduled')
        response = self.client.post(self._url(event.pk), {}, format='json')
        assert response.status_code == 400

    def test_400_if_event_not_scheduled(self):
        event = EventFactory(status='delivered')
        response = self.client.post(self._url(event.pk), self._payload(), format='json')
        assert response.status_code == 400

    def test_404_if_event_not_found(self):
        response = self.client.post(self._url(99999), self._payload(), format='json')
        assert response.status_code == 404

    def test_requires_admin(self):
        non_admin = UserFactory(is_staff=False, is_superuser=False)
        client = APIClient()
        client.force_authenticate(user=non_admin)
        event = EventFactory(status='scheduled')
        response = client.post(self._url(event.pk), self._payload(), format='json')
        assert response.status_code == 403

    def test_response_returns_updated_event(self):
        event = EventFactory(status='scheduled')
        response = self.client.post(self._url(event.pk), self._payload(), format='json')
        assert response.status_code == 200
        assert response.data['status'] == 'ordered'
