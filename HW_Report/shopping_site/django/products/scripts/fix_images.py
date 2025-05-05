import os
import json
import requests
from urllib.parse import urlparse

INPUT_JSON = "../fixtures/product.json"
OUTPUT_JSON = "../fixtures/product_fixed.json"
MEDIA_DIR = "../media/products"

os.makedirs(MEDIA_DIR, exist_ok=True)

with open(INPUT_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

for entry in data:
    if entry["model"] != "products.product":
        continue

    image_url = entry["fields"]["image"]
    image_name = os.path.basename(urlparse(image_url).path)

    # Save to media/products/xxx.jpg
    local_path = os.path.join(MEDIA_DIR, image_name)

    # If file doesn't exist, download it
    if not os.path.exists(local_path):
        print(f"⬇️ Downloading {image_url}")
        try:
            resp = requests.get(image_url, timeout=10)
            with open(local_path, "wb") as out:
                out.write(resp.content)
        except Exception as e:
            print(f"❌ Failed to download {image_url}: {e}")
            continue

    # Replace image path in JSON
    entry["fields"]["image"] = f"products/{image_name}"

# Save the updated JSON
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Done! Updated JSON saved to", OUTPUT_JSON)
