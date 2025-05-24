import requests
import json
import os
from urllib.parse import urljoin

keyword = '泡麵'
url = f'https://global.pchome.com.tw/search/tw/v3.3/all/results?q={keyword}&page=1&sort=sale/dc'
list_req = requests.get(url).content.decode('utf-8')
data = json.loads(list_req)

media_dir = os.path.join(os.path.dirname(__file__), 'shopping_site', 'django', 'media', 'products')
os.makedirs(media_dir, exist_ok=True)

base_url = 'https://cs-b.ecimg.tw'  # picS is a relative path

def download_image(image_url, filename):
    if image_url.startswith('/'):
        image_url = urljoin(base_url, image_url)
    try:
        img_data = requests.get(image_url).content
        with open(os.path.join(media_dir, filename), 'wb') as handler:
            handler.write(img_data)
    except Exception as e:
        print(f"Failed to download {image_url}: {e}")

new_list = []
for item in data['prods']:
    image_filename = os.path.basename(item['picS'])
    download_image(item['picS'], image_filename)
    new_list.append({
        "model": "products.product",
        "pk": item['Id'],
        "fields": {
            "name": item['name'],
            "description": item['describe'],
            "price": item['price'],
            "stock": 20,
            "image": f"products/{image_filename}",
            "created_at": "2024-05-01T13:20:00Z",
            "category": 6
        }
    })

# Append new_list directly to product_fixed.json
product_fixed_path = os.path.join(os.path.dirname(__file__), 'shopping_site', 'django', 'products', 'fixtures', 'product_fixed.json')
with open(product_fixed_path, 'r', encoding='utf-8') as pf:
    product_fixed = json.load(pf)

# Find the max integer pk in product_fixed
max_pk = 0
for entry in product_fixed:
    if entry.get("model") == "products.product":
        pk = entry.get("pk")
        if isinstance(pk, int) and pk > max_pk:
            max_pk = pk

# Assign new integer pk to each new product
for i, item in enumerate(new_list):
    item["pk"] = max_pk + i + 1

product_fixed.extend(new_list)
with open(product_fixed_path, 'w', encoding='utf-8') as pf:
    json.dump(product_fixed, pf, ensure_ascii=False, indent=2)