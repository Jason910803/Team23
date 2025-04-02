## 如何使用？

``` sh
$ cd HW_Report/shopping_site
$ sudo docker compose up --build
```

之後前往`http://localhost:3000`就可以看得到網頁了。
欲關閉開新的終端機跑`sudo docker compose down`或是在原本的終端機按`Ctrl-C`。

要進行前端開發可以使用`docker`的`watch mode`:
``` sh
$ sudo docker compose up --build --watch
```
或是在原本開啓的終端機按`W`鍵開關。
