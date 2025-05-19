from django.db import models

# Create your models here.
class Author(models.Model):
  name = models.CharField(max_length=100)
  bio = models.TextField(blank=True)
  
  def __str__(self):
    return self.name

class Book(models.Model):
  title = models.CharField(max_length=100)
  author = models.ForeignKey(Author, related_name='books', on_delete=models.CASCADE)
  published_date = models.DateField()
  description = models.TextField(blank=True)
  price = models.DecimalField(max_digits=6, decimal_places=2)
  
  def __str__(self):
    return self.title