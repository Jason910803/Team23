from .views import smart_search, weather_recommendation
from django.urls import path
urlpatterns = [
    path('smart-search/', smart_search, name='smart_search'),
    path('weather-recommendation/', weather_recommendation, name='weather_recommendation'),
]