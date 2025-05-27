from django.urls import path
from .views import PrizeListView

urlpatterns = [
    path('prizes/', PrizeListView.as_view(), name='prize_list'),
]
