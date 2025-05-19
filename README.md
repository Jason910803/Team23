## shopping_site
### 網站介紹
先登入才可以瀏覽商品。而登入的帳號密碼可以自行註冊再登入，也可以用現有的使用者(Jason, 12345)，登入後可以去會員資料修改密碼等等。

### 如何使用？
``` sh
$ cd HW_Report/shopping_site

# 在本地端建立image
$ sudo docker compose up --build

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

### docker image連結
前端\(react\):  https://hub.docker.com/r/lipcut/react_team23

後端\(django\): https://hub.docker.com/r/lipcut/django_team23

## new_shop
### 網站介紹
使用[Google Chrome Lab的資料](https://github.com/GoogleChromeLabs/sample-pie-shop/blob/master/src/data/products.json)實作fuzzy search，讓使用者即使打錯一些字也能找到想輸入的資料
### 使用方法
`$ cd HW_Report/new_shop/django_shop`
`python manage.py runserver`