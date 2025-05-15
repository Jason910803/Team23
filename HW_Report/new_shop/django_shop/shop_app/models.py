from django.db import models
from django.conf import settings
from django_mongodb_backend.fields import ArrayField #EmbeddedModelField, 
# from django_mongodb_backend.models import EmbeddedModel

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    features = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    keywords = models.TextField()
    url = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    voyage_embedding = ArrayField(models.FloatField(), blank=True, null=True)

    class Meta:
        db_table = "collection"
        managed = False
    
    def __str__(self):
        return self.name

