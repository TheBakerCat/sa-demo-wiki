## 9. Настройте веб-сервер nginx как обратный прокси-сервер на ISP

• При обращении по доменному имени web.au-team.irpo у клиента должно
открываться веб приложение на HQ-SRV

• При обращении по доменному имени docker.au-team.irpo клиента
должно открываться веб приложение testapp

машинка ISP
```Shell
apt-get install nginx -y
```

переходим в файл по пути `/etc/nginx/sites-available.d/default.conf`

вписываем в него
```txt:line-numbers
server {
    listen 80;
    server_name web.au-team.irpo;
    location / {
        proxy_pass http://172.16.1.2:8080;
    }
}

server {
    listen 80;
    server_name docker.au-team.irpo;
    location / {
        proxy_pass http://172.16.2.2:8080;
    }
}
```
После того как прописали

```Shell
ln -sf /etc/nginx/sites-available.d/default.conf /etc/nginx/sites-enabled.d/
```

включаемся
```Shell
systemctl enable --now nginx
```

далее заходим в HQ-CLI
файл по пути `/etc/hosts`
в нем прописываем

```txt:line-numbers
172.16.1.1 web.au-team.irpo
172.16.2.1 docker.au-team.irpo
```
::: info
Если вы тренируетесь, учтите что в прямой зоне должны быть A-тип записи
:::

сохраняем файл и вписываем в адресную строку полное доменное имя web и docker, если все удачно то у нас появится морда, но уже не по айпишнику
