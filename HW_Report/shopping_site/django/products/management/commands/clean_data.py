from django.core.management.base import BaseCommand
from products.models import Product, Category

class Command(BaseCommand):
    help = "Clean all product and category data"

    def handle(self, *args, **kwargs):
        confirm = input("⚠️ 確定要刪除所有商品與分類資料嗎？(y/N): ")
        if confirm.lower() != "y":
            self.stdout.write(self.style.WARNING("❌ 取消操作"))
            return

        product_count = Product.objects.count()
        category_count = Category.objects.count()

        Product.objects.all().delete()
        Category.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f"✅ 已刪除 {product_count} 筆商品與 {category_count} 筆分類"))
