from django.urls import path
from .views import LoginView, WhoAmIView, LogoutView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("whoami/", WhoAmIView.as_view()),  # ✅ 新增這行
    path("logout/", LogoutView.as_view()),
]
