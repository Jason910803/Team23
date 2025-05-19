from django.urls import path
from .views import LoginView, WhoAmIView, LogoutView, RegisterView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("whoami/", WhoAmIView.as_view()),  # ✅ 新增這行
    path("logout/", LogoutView.as_view()),
    path("register/", RegisterView.as_view()),
]
