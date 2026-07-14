import hashlib
import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone


class MagicLink(models.Model):
    """Single-use customer access link. Raw tokens are never stored."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='magic_links')
    order = models.ForeignKey('events.OrderBase', null=True, blank=True, on_delete=models.CASCADE, related_name='magic_links')
    token_hash = models.CharField(max_length=64, unique=True, editable=False)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode('utf-8')).hexdigest()

    @classmethod
    def create_for(cls, user, order=None):
        token = secrets.token_urlsafe(32)
        return cls.objects.create(
            user=user,
            order=order,
            token_hash=cls.hash_token(token),
            expires_at=timezone.now() + settings.MAGIC_LINK_LIFETIME,
        ), token

    @property
    def is_valid(self):
        return self.used_at is None and self.expires_at > timezone.now()
