from django.conf import settings
from django.db import models
from .terms_and_conditions import TermsAndConditions


class TermsAcceptance(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='terms_acceptances',
    )
    terms = models.ForeignKey(
        TermsAndConditions,
        on_delete=models.PROTECT,
        related_name='acceptances',
    )
    accepted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('user', 'terms')]

    def __str__(self):
        return f"{self.user} accepted {self.terms} at {self.accepted_at}"
