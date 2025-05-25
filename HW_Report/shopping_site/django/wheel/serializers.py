# c:\Users\user\Team23\HW_Report\shopping_site\wheel\serializers.py
from rest_framework import serializers
from .models import Prize

class SpinRecordSerializer(serializers.Serializer):
    prize = serializers.CharField(max_length=100, help_text="抽中的獎品名稱")

    def validate_prize(self, value):
        # 您可以在這裡添加對獎品名稱的額外驗證邏輯，如果需要
        if not value:
            raise serializers.ValidationError("獎品名稱不可為空。")
        return value

class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = ('id', 'label', 'color') # 或者您想暴露的其他欄位
