from django.urls import path
from .views import LoginView, WhoAmIView, LogoutView, RegisterView, ProfileView, SpinWheelView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("whoami/", WhoAmIView.as_view()),  # ✅ 新增這行
    path("logout/", LogoutView.as_view()),
    path("register/", RegisterView.as_view()),
    path("profile/",  ProfileView.as_view()),
    path("spin/", SpinWheelView.as_view()),
]
