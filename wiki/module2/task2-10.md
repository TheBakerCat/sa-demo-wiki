## 10.На маршрутизаторе ISP настройте web-based аутентификацию:

• При обращении к сайту web.au-team.irpo клиенту должно быть
предложено ввести аутентификационные данные

• В качестве логина для аутентификации выберите WEBс паролем
P@ssw0rd

• Выберите файл /etc/nginx/.htpasswd в качестве хранилища учётных
записей

• При успешной аутентификации клиент должен перейти на веб
сайт.

скачиваем пакет apache2-htpasswd
```Shell
apt-get install apache2-htpasswd
```

```Shell
htpasswd -c /etc/nginx/.htpasswd WEB
```
вписываем пароль P@ssw0rd 2 раза
далее заходим в файл `/etc/nginx/sites-available.d/default.conf`
добавляем
```python:line-numbers
server {
    listen 80;
    server_name web.au-team.irpo;
    location / {
        proxy_pass http://172.16.1.2:8080;
        auth_basic "Restructed area"; # [!code ++]
        auth_basic_user_file /etc/nginx/.htpasswd; # [!code ++]
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
Перезапускаем службу

```Shell
systemctl restart nginx
```

Далее заходим на HQ-CLI и пытаемся зайти на сайт web.au-team.irpo
Если у нас выходит АЧЬКО аутентификации значит все сделано верно, пробуем ввести
WEB
P@ssw0rd

и успешно авторизуемся
