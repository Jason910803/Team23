from decimal import Decimal
import json, os
from django.core.management.base import BaseCommand
from products.models import Product, Category

class Command(BaseCommand):
    help = "從 JSON 匯入商品（可包含 image 路徑）"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str)

    def handle(self, *args, **opts):
        with open(opts["json_file"], encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            category, _ = Category.objects.get_or_create(name=item["category"])

            # 只要把 image 欄位（相對路徑字串）直接塞進 create 即可
            Product.objects.create(
                name=item["name"],
                description=item.get("description", ""),
                price=Decimal(item["price"]),
                stock=item.get("stock", 0),
                category=category,
                image=item.get("image") or None,   # ← 關鍵一行
            )

        self.stdout.write(self.style.SUCCESS("✅ 匯入完成"))
