from django.apps import AppConfig


class ShopAppConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.fields.ObjectIdAutoField'
    name = 'shop_app'
