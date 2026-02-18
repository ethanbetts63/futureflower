from django.db import models
from django.utils import timezone

class TermsAndConditions(models.Model):
    """
    Represents a version of the Terms and Conditions for a specific user type.
    """
    TERMS_TYPE_CHOICES = [
        ('florist', 'Florist'),
        ('customer', 'Customer'),
        ('affiliate', 'Affiliate'),
    ]

    terms_type = models.CharField(max_length=20, choices=TERMS_TYPE_CHOICES, help_text="The user type these terms apply to.")
    version = models.CharField(max_length=20, help_text="Version number, e.g., '1.0'")
    content = models.TextField(help_text="The full HTML content of the terms and conditions.")
    published_at = models.DateTimeField(default=timezone.now, help_text="The date and time this version was published.")

    class Meta:
        verbose_name_plural = "Terms and Conditions"
        ordering = ['-published_at']
        unique_together = [('terms_type', 'version')]

    def __str__(self):
        return f"{self.get_terms_type_display()} Terms and Conditions v{self.version}"
