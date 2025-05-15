from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("products_list/", views.products_list, name="products_list"),
    path("product_detail/<str:product_id>/", views.product_detail, name="product_detail"),
]