from django.db import models

class Prize(models.Model):
    label = models.CharField(max_length=100, verbose_name="獎品名稱")
    color = models.CharField(max_length=7, default="#FFFFFF", verbose_name="顏色代碼", help_text="例如：#FF0000")
    # You can add more fields if needed, e.g. description, quantity, is_active

    def __str__(self):
        return self.label
