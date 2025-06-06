from django.contrib import admin
from .models import MyUser

# Register your models here.
@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'enabled')