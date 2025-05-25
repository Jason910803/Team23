# c:\Users\user\Team23\HW_Report\shopping_site\wheel\admin.py
from django.contrib import admin
from .models import UserSpinProfile, Prize

@admin.register(UserSpinProfile)
class UserSpinProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'spin_chances', 'last_spin_result')
    search_fields = ('user__name', 'user__email') # 改為 user__name
    list_filter = ('spin_chances',)
    # 允許在 admin 中直接修改抽獎次數
    fields = ('user', 'spin_chances', 'last_spin_result')
    readonly_fields = ('user',) # 通常不應在 UserSpinProfile 的 admin 頁面更改關聯的 user

@admin.register(Prize)
class PrizeAdmin(admin.ModelAdmin):
    list_display = ('label', 'color')
    search_fields = ('label',)
    # fields = ('label', 'color', 'description', 'quantity', 'is_active') # 如果您添加了更多欄位
