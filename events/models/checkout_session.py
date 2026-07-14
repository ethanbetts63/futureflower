import hashlib
import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone


class CheckoutSession(models.Model):
    """Opaque, browser-held authority for an in-progress guest checkout."""

    order = models.OneToOneField('events.OrderBase', on_delete=models.CASCADE, related_name='checkout_session')
    token_hash = models.CharField(max_length=64, unique=True, editable=False)
    customer_email = models.EmailField(blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode('utf-8')).hexdigest()

    @classmethod
    def create_for_order(cls, order):
        token = secrets.token_urlsafe(32)
        session = cls.objects.create(
            order=order,
            token_hash=cls.hash_token(token),
            expires_at=timezone.now() + settings.GUEST_CHECKOUT_LIFETIME,
        )
        return session, token

    @property
    def is_expired(self):
        return self.expires_at <= timezone.now()
