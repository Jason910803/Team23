from django.core.management.base import BaseCommand
from PIL import Image
import torch, pathlib
from sentence_transformers import SentenceTransformer
from products.models import Product
import pillow_heif

pillow_heif.register_avif_opener()
pillow_heif.register_heif_opener()

class Command(BaseCommand):
    help = "預先計算並儲存所有商品圖片的 CLIP 向量"

    def handle(self, *args, **kwargs):
        model = SentenceTransformer("clip-ViT-B-32")  # 512 維 :contentReference[oaicite:3]{index=3}
        model.eval()

        updated = 0
        for p in Product.objects.all():
            if not p.image or p.image_embedding:
                continue
            img_path = pathlib.Path(p.image.path)
            try:
                img = Image.open(img_path).convert("RGBA")  # 先開 RGBA, 解決 transparency 問題
                img = img.convert("RGB")  # 再轉成 RGB 給 clip 吃
            except Exception as e:
                self.stderr.write(f"[跳過] 無法開啟圖片 {img_path}: {e}")
                continue

            try:
                embedding = model.encode(
                    img,
                    device="cpu",
                    normalize_embeddings=True,
                ).tolist()
            except Exception as e:
                self.stderr.write(f"[跳過] CLIP 處理失敗 {img_path}: {e}")
                continue
            p.image_embedding = embedding
            p.save(update_fields=["image_embedding"])
            updated += 1
        self.stdout.write(f"done, updated {updated} products.")
