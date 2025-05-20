from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code != 200:
            return response

        access = response.data["access"]
        refresh = response.data["refresh"]

        res = Response({"message": "Login success"}, status=status.HTTP_200_OK)
        res.set_cookie("access_token", access, httponly=True, samesite="Lax")
        res.set_cookie("refresh_token", refresh, httponly=True, samesite="Lax")
        return res
