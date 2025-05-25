# c:\Users\user\Team23\HW_Report\shopping_site\wheel\models.py
from django.db import models
from django.conf import settings # To get AUTH_USER_MODEL
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserSpinProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='spin_profile',
        verbose_name="使用者"
    )
    spin_chances = models.PositiveIntegerField(default=0, verbose_name="剩餘抽獎次數")
    last_spin_result = models.CharField(max_length=255, blank=True, null=True, verbose_name="上次抽獎結果")
    # 您可以根據需要添加更多欄位，例如：
    # last_spin_timestamp = models.DateTimeField(null=True, blank=True, verbose_name="上次抽獎時間")
    # total_spins_done = models.PositiveIntegerField(default=0, verbose_name="總抽獎次數")

    def __str__(self):
        return f"{self.user.username} - 抽獎次數: {self.spin_chances}"

    class Meta:
        verbose_name = "使用者抽獎資料"
        verbose_name_plural = "使用者抽獎資料"

# 使用 Django Signal，在創建新使用者時自動創建 UserSpinProfile
# 這樣每個新註冊的用戶都會有一個關聯的抽獎資料記錄
User = get_user_model() # 獲取您專案中實際使用的 User 模型

@receiver(post_save, sender=User)
def create_or_update_user_spin_profile(sender, instance, created, **kwargs):
    if created:
        # 為新用戶設定初始抽獎次數，例如 1 次
        UserSpinProfile.objects.create(user=instance, spin_chances=1)
    # 如果需要在用戶模型更新時也更新 spin_profile，可以在這裡添加邏輯
    # 例如：instance.spin_profile.save()

class Prize(models.Model):
    label = models.CharField(max_length=100, verbose_name="獎品名稱")
    color = models.CharField(max_length=7, default="#FFFFFF", verbose_name="顏色代碼", help_text="例如：#FF0000")
    # 您可以添加更多欄位，例如：
    # description = models.TextField(blank=True, verbose_name="獎品描述")
    # quantity = models.PositiveIntegerField(default=0, verbose_name="庫存數量", help_text="0 表示無限量")
    # is_active = models.BooleanField(default=True, verbose_name="是否啟用")

    def __str__(self):
        return self.label
    class Meta:
        verbose_name = "獎品"
        verbose_name_plural = "獎品列表"
