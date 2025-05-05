# 作業 Week10
## 練習了哪些當週上課的主題
### Model
- successfully add product "滑鼠" with shell in Django ![shell screenshot](week10_img/shell.png)
![admin screenshot](week10_img/admin.png)

## 額外找了與當週上課的主題相關的程式技術
### uwsgi & nginx
https://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html
- `uwsgi --http :8000 --module mysite.wsgi`: should be `uwsgi --http :8000 --module backend.wsgi` and run under `/django`
- `nginx` will serve on `localhost:8080` on Mac (install with `brew install nginx`)![nginx start](week10_img/nginx.png)
- to locate `uwsgi_params`, see `/usr/local/etc/nginx` or `/opt/homebrew/etc/nginx` (Mac)
- basic nginx test: fixed by adding `127.0.0.1` to allowed_host (though `127.0.0.1` will get 502 bad gateway) ![alt text](week10_img/image-2.png)
- `uwsgi --socket :8001 --wsgi-file test.py`(requires restart nginx after a while!) ![alt text](week10_img/hello.png)
- `uwsgi --socket django.sock --wsgi-file test.py` ![alt text](week10_img/image.png)
- `uwsgi --socket django.sock --wsgi-file backend/wsgi.py --chmod-socket=664`(need generate static files by `python manage.py collectstatic` since Django static files are not automatically served by nginx) ![alt text](week10_img/image-1.png)
- `uwsgi --ini mysite_uwsgi.ini`: run under `django/`. No need to change path in `django.ini` (fixed by @呂學銘). Note that the upstream component nginx needs to connect to has to be `upstream django {server unix:/tmp/django.sock;}` in `sites-available/django_nginx.conf` (or  any similar naming like `sites-available/mysite_nginx.conf`)

## 組員分工情況

- 林姵均: uwsgi & nginx, edit Model with shell
- 呂學銘: 
- 鄭絜元: 
- 郭品謙: 