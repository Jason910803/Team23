# 作業 Week10
## 練習了哪些當週上課的主題
1. 在後端模型中加入了 Category 類別，並以 ForeignKey 建立了產品與分類的一對多資料庫關聯
2. 在前端加入 SearchBar 搜尋列，利用 axios 實作 AJAX 非同步搜尋功能，與 Django REST API 連動，達到無刷新更新商品結果的效果
3. 使用Django shell加入商品（參考課程影片Django的MVC-MTV架構）。在shell中可成功查詢新增的商品，也能在admin介面看到
![alt text](week10_img/shell.png)
![alt text](week10_img/shell_search.png)
![alt text](week10_img/admin.png)
## 額外找了與當週上課的主題相關的程式技術
### uwsgi & nginx
因課程影片中只有介紹大致過程，但因為購物網站的商品資訊、圖片量都不少，考量到影片中介紹nginx的優點，對我們的網站效能應能帶來改善，因此參考官方文件 https://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html 進行設置：(初始設置於 https://github.com/Jason910803/Team23/pull/11)
- `uwsgi --http :8000 --module mysite.wsgi`: should be `uwsgi --http :8000 --module backend.wsgi` and run under `/django`
- `nginx` will serve on `localhost:8080` on Mac (install with `brew install nginx`)![nginx start](week10_img/nginx.png)
- to locate `uwsgi_params`, see `/usr/local/etc/nginx` or `/opt/homebrew/etc/nginx` (Mac)
- basic nginx test: fixed by adding `127.0.0.1` to allowed_host (though `127.0.0.1` will get 502 bad gateway) ![alt text](week10_img/image-2.png)
- `uwsgi --socket :8001 --wsgi-file test.py`(requires restart nginx after a while!) ![alt text](week10_img/hello.png)
- `uwsgi --socket django.sock --wsgi-file test.py` ![alt text](week10_img/image.png)
- `uwsgi --socket django.sock --wsgi-file backend/wsgi.py --chmod-socket=664`(need generate static files by `python manage.py collectstatic` since Django static files are not automatically served by nginx) ![alt text](week10_img/image-1.png)
- `uwsgi --ini mysite_uwsgi.ini`: run under `django/`. No need to change path in `django.ini` (fixed by @呂學銘 in https://github.com/Jason910803/Team23/pull/12). Note that the upstream component nginx needs to connect to has to be `upstream django {server unix:/tmp/django.sock;}` in `sites-available/django_nginx.conf` (or  any similar naming like `sites-available/mysite_nginx.conf`)

## 組員分工情況

- 林姵均: uwsgi & nginx, Django shell
- 呂學銘: 
- 鄭絜元: implement searchbar & build category
- 郭品謙: 