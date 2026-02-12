# futureflower/events/models/flower_type.py
from django.db import models

class FlowerType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
