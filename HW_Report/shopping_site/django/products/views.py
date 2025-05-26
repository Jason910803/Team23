from django.shortcuts import render
from rest_framework import viewsets, serializers
from .models import Product
from rest_framework import filters
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import os, traceback
import google.generativeai as genai
# For image searching
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from PIL import Image
import torch
from sentence_transformers import SentenceTransformer
from functools import lru_cache


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

def extract_keywords(text):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not set !!!")
        return JsonResponse({'error': 'Gemini API key not set'}, status=500)
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"從以下需求句子萃取顏色與服裝類型（最多 5 個詞），\
             只回半形逗號分隔關鍵字：『{text}』"
    resp = model.generate_content(prompt, generation_config={"response_mime_type": "text/plain"})
    print("Gemini API response:", resp)
    # 🔹 確保回傳 list（非 set）
    return [kw.strip() for kw in resp.text.split(",") if kw.strip()]

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

@lru_cache(maxsize=1)
def get_clip_model():
    print("🧠 正在載入 CLIP 模型中...")
    model = SentenceTransformer("clip-ViT-B-32")
    model.eval()
    return model

@csrf_exempt 
@api_view(["POST"])
@permission_classes([AllowAny])
def image_search(request):
    img_file = request.FILES.get("image")
    if not img_file:
        return JsonResponse({"error": "No image uploaded"}, status=400)

    # 1) 取得查詢圖片向量
    clip_model = get_clip_model()
    query_emb = clip_model.encode(
        Image.open(img_file).convert("RGB"),
        device="cpu",
        normalize_embeddings=True,
    )
    query_emb = torch.tensor(query_emb)          # shape (512,)

    # 2) 抓出所有已建索引的商品向量
    products = Product.objects.filter(image_embedding__isnull=False)
    if not products:
        return JsonResponse({"results": []})

    embeddings = torch.tensor([p.image_embedding for p in products])  # (N,512)
    scores = torch.mv(embeddings, query_emb)  # 內積 = cosine，相容 torch 2.x
    topk = torch.topk(scores, k=min(20, len(products)))  # 取前 20

    # 3) 整理回傳
    result = []
    for idx in topk.indices.tolist():
        p = products[idx]
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": str(p.price),
            "image": p.image.url if p.image else None,
            "category": p.category.name if p.category else None,
            "score": float(scores[idx]),
        })
    return JsonResponse({"results": result})

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def image_prompt_search(request):
    try:
        img_file = request.FILES.get("image")
        prompt_text = request.POST.get("prompt", "")
        if not img_file:
            return JsonResponse({"error": "No image uploaded"}, status=400)

        # 1. 圖片向量
        img_emb = clip_model.encode(
            Image.open(img_file).convert("RGB"),
            device="cpu",
            normalize_embeddings=True,
        )

        # 2. 處理文字提示
        if prompt_text.strip():
            keywords = extract_keywords(prompt_text)  # list[str]
            text_phrase = " ".join(keywords) or prompt_text
            text_emb = clip_model.encode(
                text_phrase, device="cpu", normalize_embeddings=True
            )
            query_emb = img_emb + 10 * text_emb
        else:
            query_emb = img_emb

        # 3. 相似度比對
        products = Product.objects.filter(image_embedding__isnull=False)
        if not products:
            return JsonResponse({"results": []})

        embeddings = torch.tensor([p.image_embedding for p in products])
        scores = torch.mv(embeddings, torch.tensor(query_emb))  # cosine

        topk = torch.topk(scores, k=min(20, len(products)))
        result = []
        for idx in topk.indices.tolist():
            p = products[idx]
            result.append({
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": str(p.price),               # 🔹 Decimal → str
                "image": p.image.url if p.image else None,
                "category": p.category.name if p.category else None,
                "score": float(scores[idx]),          # 🔹 Tensor → float
            })

        return JsonResponse({"results": result})

    except RuntimeError as e:       # 例如 GEMINI_API_KEY 缺失
        return JsonResponse({"error": str(e)}, status=500)

    except Exception as e:
        # 其它未預期錯誤：印 log 再回 500
        traceback.print_exc()
        return JsonResponse({"error": "Server error", "detail": str(e)}, status=500)