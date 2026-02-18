from django.db import models
from django.conf import settings


class Notification(models.Model):
    RECIPIENT_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('partner', 'Partner'),
        ('customer', 'Customer'),
    )
    CHANNEL_CHOICES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )

    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPE_CHOICES)
    # Only one of these will be set, depending on recipient_type:
    recipient_partner = models.ForeignKey(
        'partners.Partner',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='notifications',
    )
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='notifications',
    )
    # Admin recipients are resolved from settings at send time — no FK needed.

    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255, null=True, blank=True)  # email only
    body = models.TextField()

    scheduled_for = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    # Traceability
    related_event = models.ForeignKey(
        'events.Event',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='notifications',
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_for']
