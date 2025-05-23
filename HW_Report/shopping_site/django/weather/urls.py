from django.urls import path
from .views import get_weather

urlpatterns = [
    path("current/", get_weather, name="get_weather"),
]