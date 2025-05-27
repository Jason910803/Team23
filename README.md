## shopping_site
### 網站介紹
先登入才可以瀏覽商品。而登入的帳號密碼可以自行註冊再登入，也可以用現有的使用者(Jason, 12345)，登入後可以去會員資料修改密碼等等。

### 如何使用？
``` sh
$ cd HW_Report/shopping_site

# 在本地端建立image
$ sudo docker compose build --no-cache
$ sudo docker compose up

# 從docker pull已建立好的image
$ sudo docker compose up
```

之後前往`http://localhost:3000`就可以看得到網頁了。
欲關閉開新的終端機跑`sudo docker compose down`或是在原本的終端機按`Ctrl-C`。

要進行前端開發可以使用`docker`的`watch mode`:
``` sh
$ sudo docker compose up --build --watch
# 或
$ sudo docker compose up --watch
```
或是在原本開啓的終端機按`W`鍵開關。

### 注意事項
若大家發現本地的資料庫有落後，需要跑以下指令確保能正常運行功能
```
sudo docker compose run --rm django python manage.py makemigrations
sudo docker compose run --rm django python manage.py migrate
```
### API Key設定
以下`your_actual_gemini_api_key`與`your_actual_weather_api_key`皆需替換成真實Key值，可至 https://aistudio.google.com/u/2/apikey 與 https://openweathermap.org/api 申請。
#### Gemini
在專案根目錄（與 `docker-compose.yml` 同一層）新增一個名為 `.env` 的檔案，內容如下：

```
GEMINI_API_KEY=your_actual_gemini_api_key
```
這樣 Docker 就會自動讀取 .env 並注入到 container 的環境變數中。
#### OpenWeatherMap
在同樣的`.env`檔內，加入
```
WEATHER_API_KEY=your_actual_weather_api_key
```

### 以圖搜商品
若有新加入的產品, 跑以下的指令可以產生圖片的 embedding 加到 database 裡
```
sudo docker compose run --rm django python manage.py build_image_index
```
原理就是先用 CLIP 提取 image imbedding 存回 database，然後用戶上傳圖片後也對圖片取出 embedding 再跟資料庫的圖片 embedding 算 cosine similarity 比對相似度，最後回傳 top k 的商品

- 若發現搜尋不出結果，可能是因為商品的 embedding 還沒有建立，可以去後台看商品的 embedding 是不是 null，是的話跑上面的指令就可以建立了
- 因為現在是執行第一次圖片比對後才把 model load 進來，因此第一次搜尋會需要等一下，好處是 `docker compose up` 時會快很多
- 可以在 `django/data/products.json` 自己加商品，然後跑 `sudo docker compose run --rm django python manage.py import_products data/products.json` 

### docker image連結
前端\(react\):  https://hub.docker.com/r/lipcut/react_team23

後端\(django\): https://hub.docker.com/r/lipcut/django_team23

## new_shop
### 網站介紹
使用[Google Chrome Lab的資料](https://github.com/GoogleChromeLabs/sample-pie-shop/blob/master/src/data/products.json)串接MongoDB實作fuzzy search，讓使用者即使打錯一些字也能找到想輸入的資料
### 使用方法
`$ cd HW_Report/new_shop/django_shop`
`python manage.py runserver`
