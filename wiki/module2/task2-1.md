# Настройте контроллер домена Samba DC на сервере BR-SRV:

::: details Задания

* Имя домена au-team.irpo

* Введите в созданный домен машину HQ-CLI

* Создайте 5 пользователей для офиса HQ: имена пользователей формата hquser№ (например hquser1, hquser2 и т.д.)

* Создайте группу hq, введите в группу созданных пользователей

* Убедитесь, что пользователи группы hq имеют право аутентифицироваться на HQ-CLI

* Пользователи группы hq должны иметь возможность повышать
привилегии для выполнения ограниченного набора команд: cat, grep, id.
Запускать другие команды с повышенными привилегиями пользователи
группы права не имеют.

:::
## 1. Запуск и первичная настройка samba

Устонавливаем samba

```python:line-numbers
apt-get install task-samba-dc
```

Запускаем программу настройки

```
samba-tool domain provision
```

Псоле этого программа будет просить ввести параметры

```
Realm: au-team.irpo
```

Далее пропускаем всё с помощью Enter

```
Domain [au-team]:

Server Role (dc, member, standalone) [dc]:

DNS backend (SAMBA_INTERNAL, BIND9_FLATFILE, BIND9_DLZ, NONE) [SAMBA_INTERNAL]:
```

Здесь прописываем любой DNS сервер, например 1.1.1.1:
```
DNS forwarder IP address (write 'none' to disable forwarding) [127.0.0.1]:1.1.1.1
```

Ставим программу на автозапуск и запускаем

```
 systemctl enable --now samba
```

## 2. Введение в созданный домен машину HQ-CLI
Заходим на HQ-CLI --> Меню(снизу слева) --> Раздел Приложения --> Администрирование --> Центр управления системой --> Раздел Пользователи --> Аутентификация

Выбираем пункт Домен Active Directory

Вводим au-team.irpo в поле Домен

Листаем вниз и нажимаем применить

## 3. Создание 5 пользователей для офиса HQ

Создаём пользавтелей

samba-tool user add hquser1 Aaaa123

samba-tool user add hquser2 Aaaa123

samba-tool user add hquser3 Aaaa123

samba-tool user add hquser4 Aaaa123

samba-tool user add hquser5 Aaaa123

Теперь создадим группу и поместим туда созданных пользователей:

samba-tool group add hq

samba-tool group addmembers hq hquser1,hquser2,hquser3,hquser4,hquser5
