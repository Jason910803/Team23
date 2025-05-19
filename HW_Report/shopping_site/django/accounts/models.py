from django.db import models

# Create your models here.
class MyUser(models.Model):
    name = models.CharField(max_length=20, null=False, unique=True)  # ➕ unique 限制帳號不重複
    email = models.EmailField()
    password = models.CharField(max_length=20, null=False)
    enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.name
