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
<!--
Services:
testapp:
db:
container_name: testapр
image: site
restart: always
networks:
- testnet
ports:
- "8080:8000"
environment:
DB_HOST: db
DB_PORT: 3306
DB_TYPE: maria
DB_NAME: mariadb
DB_USER: maria
DB_PASS: Password
container_name: db
image: mariadb
networks:
- testnet
ports:
- "3306:3306"
environment:
MARIADB_USER: maria
MARIADB_PASSWORD: Password
MARIADB_DATABASE: mariadb
MARIADB_ROOT_PASSWORD: Password
restart: unless-stopped
networks:
Tasks
Cluster log
• Поиск
-->
testnet:
driver: bridge
internal: true
