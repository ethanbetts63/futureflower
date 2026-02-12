from django.db import models


class ServiceArea(models.Model):
    partner = models.ForeignKey(
        'partners.Partner',
        on_delete=models.CASCADE,
        related_name='service_areas'
    )
    suburb = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('partner', 'suburb', 'city', 'country')

    def __str__(self):
        return f"{self.suburb}, {self.city}, {self.country}"
