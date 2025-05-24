from django.shortcuts import render
from rest_framework import viewsets, serializers
from .models import Product
from rest_framework import filters
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import os
import google.generativeai as genai

# Create your views here.
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'stock', 'image', 'category_name')

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at']

@csrf_exempt
def smart_search(request):
    query = request.GET.get('query', '')
    print("Received query:", query)
    if not query:
        return JsonResponse({'results': []})

    # 1. Call Gemini API
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not set !!!")
        return JsonResponse({'error': 'Gemini API key not set'}, status=500)
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    user_message = f"根據用戶查詢：'{query}'，列出3-5個關鍵字或產品類型，這些關鍵字或產品類型與網購商品搜索相關。僅輸出半形逗號分隔的列表。"
    try:
        result = model.generate_content(
            user_message,
            generation_config={"response_mime_type": "text/plain"},
        )
        print("Gemini API response:", result)
        gemini_text = result.text
        keywords = [kw.strip() for kw in gemini_text.split(',') if kw.strip()]
    except Exception as e:
        return JsonResponse({'error': 'Gemini API error', 'details': str(e)}, status=500)

    # 2. Search products by keywords
    q_obj = Q()
    for kw in keywords:
        q_obj |= Q(name__icontains=kw) | Q(description__icontains=kw) | Q(category__name__icontains=kw)
    products = Product.objects.filter(q_obj).distinct()
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'image': p.image.url if p.image else None,
            'category': p.category.name if p.category else None,
        }
        for p in products
    ]
    return JsonResponse({'results': data})

@csrf_exempt
def weather_recommendation(request):
    city = request.GET.get('city', '')
    temp = request.GET.get('temp', '')
    desc = request.GET.get('desc', '')
    if not city or not temp or not desc:
        return JsonResponse({'results': []})

    # 1. Call Gemini API
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not set !!!")
        return JsonResponse({'error': 'Gemini API key not set'}, status=500)
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    user_message = f"用戶現在所在地——{city}——的氣溫是{temp}°C，天氣描述是{desc}。根據這個天氣，列出3-5個產品類型。這些關鍵字或產品類型與網購商品搜索相關。僅輸出半形逗號分隔的列表。"
    try:
        result = model.generate_content(
            user_message,
            generation_config={"response_mime_type": "text/plain"},
        )
        print("Gemini API response:", result)
        gemini_text = result.text
        keywords = [kw.strip() for kw in gemini_text.split(',') if kw.strip()]
    except Exception as e:
        return JsonResponse({'error': 'Gemini API error', 'details': str(e)}, status=500)

    # 2. Search products by keywords
    q_obj = Q()
    for kw in keywords:
        q_obj |= Q(name__icontains=kw) | Q(description__icontains=kw) | Q(category__name__icontains=kw)
    products = Product.objects.filter(q_obj).distinct()
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'image': p.image.url if p.image else None,
            'category': p.category.name if p.category else None,
        }
        for p in products
    ]
    return JsonResponse({'results': data})