# c:\Users\user\Team23\HW_Report\shopping_site\wheel\urls.py
from django.urls import path
from .views import UserSpinChancesView, RecordSpinView, PrizeListView

app_name = 'wheel' # app 的 URL 命名空間

urlpatterns = [
    # 前端 Wheel.jsx 使用的 API 路徑
    path('user/spin-chances/', UserSpinChancesView.as_view(), name='user_spin_chances'),
    path('user/record-spin/', RecordSpinView.as_view(), name='record_spin'),
    path('prizes/', PrizeListView.as_view(), name='prize_list'), # 新增獎品列表 API
]
