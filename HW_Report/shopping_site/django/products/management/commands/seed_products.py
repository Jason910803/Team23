from django.core.management.base import BaseCommand
from products.models import Product, Category
from faker import Faker
import random
from django.utils import timezone

class Command(BaseCommand):
    help = "Seed the database with categories and sample products"

    def handle(self, *args, **kwargs):
        fake = Faker("zh_TW")

        # 刪除舊資料（可選）
        Product.objects.all().delete()
        Category.objects.all().delete()

        # 分類名稱
        category_names = ["電子產品", "家電", "美妝", "文具", "服飾"]
        categories = []

        for name in category_names:
            category = Category.objects.create(
                name=name,
                description=fake.text(max_nb_chars=50)
            )
            categories.append(category)

        for category in categories:
            for _ in range(5):
                Product.objects.create(
                    name=fake.catch_phrase(),
                    description=fake.text(max_nb_chars=200),
                    price=random.randint(100, 10000),
                    stock=random.randint(1, 100),
                    image=f"https://picsum.photos/seed/{random.randint(1, 9999)}/400/300",
                    created_at=timezone.now(),
                    category=category
                )

        self.stdout.write(self.style.SUCCESS("✅ 成功建立 5 個分類與 25 筆商品（含圖片）"))
