from .views import smart_search
from django.urls import path
urlpatterns = [
    path('smart-search/', smart_search, name='smart_search'),
]