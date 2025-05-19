from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from myapp.views import ProtectedView, LogoutView

from rest_framework_simplejwt.views import (
  TokenObtainPairView,
  TokenRefreshView,
)

from django.urls import include
from rest_framework.routers import DefaultRouter
from myapp.views import AuthorViewSet, BookViewSet

router = DefaultRouter()
router.register(r'authors', AuthorViewSet)
router.register(r'books', BookViewSet)


def chat_view(request):
    return render(request, 'chat.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', chat_view, name='chat'),
    
    path('api/protected/', ProtectedView.as_view(), name='protected'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),

    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
