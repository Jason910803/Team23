from django.shortcuts import render

# Create your views here.
# c:\Users\user\Team23\HW_Report\shopping_site\wheel\views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
# from django.shortcuts import get_object_or_404 # 保留以備不時之需
from django.utils import timezone # 如果需要記錄時間戳

from .models import UserSpinProfile, Prize
from .serializers import SpinRecordSerializer, PrizeSerializer

class UserSpinChancesView(APIView):
    """
    獲取當前登入使用者的剩餘抽獎次數。
    """
    permission_classes = [IsAuthenticated] # 只有登入用戶才能訪問

    def get(self, request):
        # get_or_create 確保即使 UserSpinProfile 記錄不存在（例如舊用戶或 signal 未觸發），也會創建一個
        # 這裡依賴於 UserSpinProfile 模型中 spin_chances 的 default 值，或 signal 中的初始值
        spin_profile, created = UserSpinProfile.objects.get_or_create(user=request.user)
        return Response({'chances': spin_profile.spin_chances}, status=status.HTTP_200_OK)

class RecordSpinView(APIView):
    """
    記錄一次抽獎結果，並減少使用者的抽獎次數。
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SpinRecordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prize_label = serializer.validated_data['prize']
        
        spin_profile, _ = UserSpinProfile.objects.get_or_create(user=request.user)

        if spin_profile.spin_chances <= 0:
            return Response({'error': '您的抽獎次數已用完！'}, status=status.HTTP_400_BAD_REQUEST)

        spin_profile.spin_chances -= 1
        spin_profile.last_spin_result = prize_label
        # spin_profile.last_spin_timestamp = timezone.now() # 可選：記錄抽獎時間
        # spin_profile.total_spins_done +=1 # 可選：累計總抽獎次數
        spin_profile.save()

        # 您也可以考慮建立一個單獨的 SpinLog 模型來記錄每一次抽獎的詳細歷史
        # SpinLog.objects.create(user=request.user, prize=prize_label, timestamp=timezone.now())

        return Response({
            'message': '抽獎結果已成功記錄。',
            'remaining_chances': spin_profile.spin_chances
        }, status=status.HTTP_200_OK)

class PrizeListView(APIView):
    """
    獲取所有可用的獎品列表。
    """
    def get(self, request):
        prizes = Prize.objects.filter(is_active=True) # 假設您添加了 is_active 欄位
        # prizes = Prize.objects.all() # 或者獲取所有獎品
        serializer = PrizeSerializer(prizes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
