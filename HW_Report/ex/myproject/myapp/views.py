from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import filters
from rest_framework import viewsets, permissions
from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer

class ProtectedView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request):
    return Response({
      "message": "您已通過認證",
      "user_id": request.user.id,
      "username": request.user.username
    })

class LogoutView(APIView):
  permission_classes = [IsAuthenticated]
  
  def post(self, request):
    try:
      refresh_token = request.data.get("refresh")
      if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=400)
        
      token = RefreshToken(refresh_token)
      token.blacklist()
      
      return Response({
        "success": True,
        "message": "您已成功登出",
        "status": "Token has been blacklisted successfully"
      })
    except Exception as e:
      return Response({
        "success": False,
        "error": str(e),
        "message": "登出時發生錯誤"
      }, status=400)
    

class AuthorViewSet(viewsets.ModelViewSet):
  queryset = Author.objects.all()
  serializer_class = AuthorSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  
class BookViewSet(viewsets.ModelViewSet):
  queryset = Book.objects.all()
  serializer_class = BookSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['title', 'author__name']
  ordering_fields = ['title', 'published_date', 'price']