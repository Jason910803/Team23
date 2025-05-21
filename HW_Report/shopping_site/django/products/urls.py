from .views import smart_search
from django.urls import path
urlpatterns = [
    path('api/smart-search/', smart_search, name='smart_search_api'),
]