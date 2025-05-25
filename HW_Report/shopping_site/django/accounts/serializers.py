from rest_framework import serializers
from .models import MyUser

class MyUserSerializer(serializers.ModelSerializer):
    # 不回傳密碼，只有寫入時才用得到
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model  = MyUser
        fields = ("name", "email", "password", "enabled", "spin_chances", "last_prize")
