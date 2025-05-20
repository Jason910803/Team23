from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProfileSerializer
import logging

logger = logging.getLogger(__name__)  # 可用 logger.debug/info/warning

@method_decorator(csrf_exempt, name='dispatch')  # 開發期間可先跳過 CSRF 驗證
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            res = Response({"message": "Login success"}, status=status.HTTP_200_OK)
            res.set_cookie("access_token", access, httponly=True, samesite="Lax")
            res.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax")
            return res

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')  # 開發階段用，建議之後改成正式 CSRF 驗證
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


class WhoAmIView(APIView):
    def get(self, request):
        user = request.user
        return Response({"username": user.username})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "缺少必要欄位"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "帳號已存在"}, status=400)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "註冊成功！"}, status=201)


class ProfileView(APIView):
    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)
