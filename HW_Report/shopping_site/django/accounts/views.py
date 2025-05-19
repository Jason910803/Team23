# accounts/views.py
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import MyUser
import logging

logger = logging.getLogger(__name__)  # 可用 logger.debug/info/warning

@method_decorator(csrf_exempt, name='dispatch')  # 開發期間可先跳過 CSRF 驗證
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        logger.info(f"🔐 嘗試登入：{username}")
        print("Request body:", request.data)

        try:
            user = MyUser.objects.get(name=username)
            if user.password == password:
                request.session['username'] = user.name
                request.session['useremail'] = user.email
                logger.info(f"✅ 登入成功：{username}")
                return Response({"message": "Login successful"})
            else:
                logger.warning(f"❌ 密碼錯誤：{username}")
                return Response({"error": "Wrong password"}, status=status.HTTP_401_UNAUTHORIZED)
        except MyUser.DoesNotExist:
            logger.warning(f"❌ 找不到使用者：{username}")
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')  # 開發階段用，建議之後改成正式 CSRF 驗證
class LogoutView(APIView):
    def post(self, request):
        # 清除整個 session
        request.session.flush()
        logger.info("🚪 使用者已登出")
        return Response({"message": "Logged out"})

        
class WhoAmIView(APIView):
    def get(self, request):
        username = request.session.get("username")
        if username:
            return Response({"username": username})
        return Response({"username": None})

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not password:
            return Response({"error": "缺少必要欄位"}, status=400)

        if MyUser.objects.filter(name=name).exists():
            return Response({"error": "帳號已存在"}, status=400)

        user = MyUser.objects.create(name=name, email=email, password=password)
        return Response({"message": "註冊成功！"}, status=201)