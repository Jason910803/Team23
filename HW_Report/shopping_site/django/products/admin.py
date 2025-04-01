from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'stock')

# Register your models here.
admin.site.register(Product, ProductAdmin)
