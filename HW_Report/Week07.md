# 作業 Week07
## 練習了哪些當週上課的主題
- django
- docker
## 額外找了與當週上課的主題相關的程式技術
- 使用 npm run build 結合 react 和 django
## Docker Image Pull 連結及啟動方式說明
### docker image連結
前端\(react\):  https://hub.docker.com/r/lipcut/react_team23

後端\(django\): https://hub.docker.com/r/lipcut/django_team23
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
## 組員分工情況

- 林姵均: 30% 初步結合react和django
- 呂學銘: 40% 部署docker，完善django基礎架設
- 鄭絜元: 30% 重構前端 layout 並實作 SPA 架構與模組化分頁
- 郭品謙: 
