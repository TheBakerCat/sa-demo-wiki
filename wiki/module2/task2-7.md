## 7. Разверните веб приложение на сервере HQ-SRV:

• Используйте веб-сервер apache

• В качестве системы управления базами данных используйте mariadb

• Файлы веб приложения и дамп базы данных находятся в директории web
образа Additional.iso

• Выполните импорт схемы и данных из файла dump.sql в базу данных
webdb

• Создайте пользователя webс паролем P@ssw0rd и предоставьте ему
права доступа к этой базе данных

• Файлы index.php и директорию images скопируйте в каталог веб сервера
apache

• В файле index.php укажите правильные учётные данные для
подключения к БД

• Запустите веб сервер и убедитесь в работоспособности приложения

• Основные параметры отметьте в отчёте

::: info
для этого задание необходимо также пробросить образ Additional.iso, но уже на машину HQ-SRV
:::

```Shell
apt-get install lamp-server -y
```
Если у вас какие-то проблемы с установкой пакетов, необходимо прописать команду apt-get update

Монтируем образ
```Shell
mount /dev/sr0 /mnt/

cp /mnt/web/index.php /var/www/html/
cp /mnt/web/logo.png /var/www/html/
```

Заходим в файл `/var/www/html/index.php`
и изменяем параметры:
```txt:line-numbers
$servername = "localhost";
$username = "webc";
$password = "P@ssw0rd";
$dbname = "webdb";
```
```Shell
systemctl enable --now mariadb

mariadb -u root
```

В появившемся поочередно прописываем:
```Shell
CREATE DATABASE webdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'webc'@'localhost' IDENTIFIED BY 'P@ssw0rd';

GRANT ALL PRIVILEGES ON webdb.* TO 'webc'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

Запускаем веб-сервер apache

```Shell
systemctl enable --now httpd2
```

```Shell
mariadb -u webc -p webdb < /mnt/web/dump.sql
```
Попросит ввести пароль, если все правильно то никаких ошибок не будет

Далее заходим на машину HQ-CLI и вписываем в адресную строку браузера 192.168.100.2

Появилась еще одна морда? двигаемся дальше








