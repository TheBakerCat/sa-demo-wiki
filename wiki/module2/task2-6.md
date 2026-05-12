## 6. Разверните веб приложение в docker на сервере BR-SRV:

• Средствами docker должен создаваться стек контейнеров с веб
приложением и базой данных

• Используйте образы site_latestи mariadb_latestрасполагающиеся в
директории docker в образе Additional.iso

• Основной контейнер testapp должен называться tespapp

• Контейнер с базой данных должен называться db

• Импортируйте образы в docker, укажите в yaml файле параметры
подключения к СУБД, имя БД - testdb, пользователь testс паролем
P@ssw0rd, порт приложения 8080, при необходимости другие
параметры

• Приложение должно быть доступно для внешних подключений через
порт 8080

::: info
Чтобы выполнить это задание вам необходимо пробросить iso образ Aditional в машину BR-SRV
:::
Устанавливаем нужные пакеты:

```Shell
apt-get update && apt-get install docker-engine docker-compose -y
```

```Shell
systemctl enable --now docker
```
Далее нам необходимо смонтировать нужные образы для дальнейшей загрузки в docker

```Shell
mount /dev/sr0 /mnt/

docker load -i /mnt/docker/site_latest.tar
docker load -i /mnt/docker/mariadb_latest.tar
```
Проверить успешность загрузки можно посредством выполнения команды

```Shell
docker images
```
Создаем файл по пути /root/compose.yaml

::: info
Учтите что docker не простит вам если вы не будете соблюдать табуляцию
:::
```txt:line-numbers
services:
  database:
    container_name: db
    image: mariadb:10.11
    restart: always
    ports:
      - "3306:3306"
    environment:
      MARIADB_DATABASE: testdb
      MARIADB_USER: test
      MARIADB_PASSWORD: P@ssw0rd
      MARIADB_ROOT_PASSWORD: root
#на пользователях ДЭ пароль будет другой учитывайте это а не слепо копируйте
  app:
    container_name: tespapp
#название контейнера правильное, в задании написано, что основной контейнер testapp должен называться tespapp
#при дальнейшей настройки docker это может ввести вас в заблуждение
    image: site:latest
    restart: always
    ports:
      - "8080:8000"
    environment:
      DB_TYPE: maria
      DB_HOST: 192.168.3.2
      DB_PORT: "3306"
      DB_NAME: testdb
      DB_USER: test
      DB_PASS: P@ssw0rd
    depends_on:
      - database
```

Прописываем команду
```python
docker compose up -d
```

если у вас вышли какие то ошибки, скорее всего они связанны с конфигом, в этом вам может помочь команды
```Shell
docker logs -f tespapp
```
Далее смотрим команду docker compose ps, важно, чтобы в столбе PORTS не было пусто, если у вас ничего нет а контейнеры уходят в restart, значит, у вас ошибка конфигурации

Идем на машину HQ-CLI и вписываем в адресную строку браузера 192.168.3.2:8080

Если у вас появился сайт, значит вы прекрасны
