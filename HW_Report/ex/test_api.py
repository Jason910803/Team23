#!/usr/bin/env python
import requests
import json
from datetime import datetime

# API 基本URL
BASE_URL = 'http://localhost:9000/api/'

# 測試用戶憑證
USERNAME = 'admin'
PASSWORD = '123456'

# 獲取 JWT Token
def get_token():
  response = requests.post(
    f'{BASE_URL}token/',
    data={'username': USERNAME, 'password': PASSWORD}
  )
  if response.status_code == 200:
    return response.json()
  else:
    raise Exception(f"無法獲取token: {response.text}")

# 測試獲取所有書籍
def test_get_books(token=None):
  headers = {}
  if token:
    headers['Authorization'] = f'Bearer {token}'
  
  response = requests.get(f'{BASE_URL}books/', headers=headers)
  print(f"GET /books/ 狀態碼: {response.status_code}")
  
  if response.status_code == 200 and response.json():
    # print(response.content)
    books = response.json()
    print(f"找到 {len(books['results'])} 本書:")
    for book in books['results']:
      print(f"  - {book['title']} (作者: {book['author_name']})")
  else:
    print(f"錯誤: {response.text}")
  
  return response.status_code == 200

# 測試創建新書籍
def test_create_book(token, author_id):
  headers = {'Authorization': f'Bearer {token}'}
  
  new_book = {
    'title': f'測試書籍 {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
    'author': author_id,
    'published_date': '2023-06-15',
    'description': '這是一本API測試用書',
    'price': '29.99'
  }
  
  response = requests.post(
    f'{BASE_URL}books/',
    headers=headers,
    json=new_book
  )
  
  print(f"POST /books/ 狀態碼: {response.status_code}")
  
  if response.status_code == 201:
    book = response.json()
    print(f"成功創建書籍: {book['title']} (ID: {book['id']})")
    return book['id']
  else:
    print(f"錯誤: {response.text}")
    return None

# 測試獲取單本書籍
def test_get_book(token, book_id):
  headers = {}
  if token:
    headers['Authorization'] = f'Bearer {token}'
  
  response = requests.get(f'{BASE_URL}books/{book_id}/', headers=headers)
  print(f"GET /books/{book_id}/ 狀態碼: {response.status_code}")
  
  if response.status_code == 200:
    book = response.json()
    print(f"成功獲取書籍: {book['title']}")
    print(f"  - 作者: {book['author_name']}")
    print(f"  - 發布日期: {book['published_date']}")
    print(f"  - 價格: ${book['price']}")
  else:
    print(f"錯誤: {response.text}")
  
  return response.status_code == 200

# 測試更新書籍
def test_update_book(token, book_id):
  headers = {'Authorization': f'Bearer {token}'}
  
  # 先獲取現有數據
  response = requests.get(f'{BASE_URL}books/{book_id}/', headers=headers)
  if response.status_code != 200:
    print(f"無法獲取書籍進行更新: {response.text}")
    return False
  
  book = response.json()
  book['description'] = f'更新的描述 {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
  book['price'] = '39.99'
  
  response = requests.put(
    f'{BASE_URL}books/{book_id}/',
    headers=headers,
    json=book
  )
  
  print(f"PUT /books/{book_id}/ 狀態碼: {response.status_code}")
  
  if response.status_code == 200:
    updated_book = response.json()
    print(f"成功更新書籍: {updated_book['title']}")
    print(f"  - 新價格: ${updated_book['price']}")
    print(f"  - 新描述: {updated_book['description']}")
    return True
  else:
    print(f"錯誤: {response.text}")
    return False

# 測試刪除書籍
def test_delete_book(token, book_id):
  headers = {'Authorization': f'Bearer {token}'}
  
  response = requests.delete(
    f'{BASE_URL}books/{book_id}/',
    headers=headers
  )
  
  print(f"DELETE /books/{book_id}/ 狀態碼: {response.status_code}")
  
  if response.status_code == 204:
    print(f"成功刪除書籍 ID: {book_id}")
    return True
  else:
    print(f"錯誤: {response.text}")
    return False

# 獲取所有作者
def get_first_author_id(token=None):
  headers = {}
  if token:
    headers['Authorization'] = f'Bearer {token}'
  
  response = requests.get(f'{BASE_URL}authors/', headers=headers)
  
  if response.status_code == 200 and response.json():
    authors = response.json()
    if authors['results']:
      return authors['results'][0]['id']
  
  # 如果沒有作者，創建一個
  elif token:
    print("沒有找到作者，創建一個新的作者")
    headers = {'Authorization': f'Bearer {token}'}
    new_author = {
      'name': '測試作者',
      'bio': '用於API測試的作者'
    }
    
    response = requests.post(
      f'{BASE_URL}authors/',
      headers=headers,
      json=new_author
    )
    
    if response.status_code == 201:
      return response.json()['id']
  
  return None

# 主函數
def main():
#   try:
    # 嘗試獲取不需要登錄的資源
    print("=== 測試匿名訪問 ===")
    test_get_books()
    
    # 獲取Token
    print("\n=== 獲取認證Token ===")
    tokens = get_token()
    access_token = tokens['access']
    
    # 獲取作者ID
    author_id = get_first_author_id(access_token)
    if not author_id:
      print("錯誤: 無法獲取作者")
      return
    
    # 創建新書籍
    print("\n=== 創建新書籍 ===")
    book_id = test_create_book(access_token, author_id)
    if not book_id:
      return
    
    # 獲取單本書籍
    print("\n=== 獲取單本書籍 ===")
    test_get_book(access_token, book_id)
    
    # 更新書籍
    print("\n=== 更新書籍 ===")
    test_update_book(access_token, book_id)
    
    # 再次獲取書籍查看更新
    print("\n=== 確認更新結果 ===")
    test_get_book(access_token, book_id)
    
    # 刪除書籍
    print("\n=== 刪除書籍 ===")
    test_delete_book(access_token, book_id)
    
    # 確認刪除成功
    print("\n=== 確認刪除結果 ===")
    response = requests.get(f'{BASE_URL}books/{book_id}/')
    if response.status_code == 404:
      print(f"確認書籍已刪除，找不到ID: {book_id}")
    else:
      print(f"警告: 書籍未成功刪除，狀態碼: {response.status_code}")
    
#   except Exception as e:
#     print(f"測試過程中發生錯誤: {str(e)}")

if __name__ == "__main__":
  main()