from .views import smart_search, weather_recommendation, image_search, image_prompt_search
from django.urls import path
urlpatterns = [
    path('smart-search/', smart_search, name='smart_search'),
    path('weather-recommendation/', weather_recommendation, name='weather_recommendation'),
    path('image-search/', image_search, name='image_search'),
    path('mix-search/', image_prompt_search, name='image_prompt_search'),
]