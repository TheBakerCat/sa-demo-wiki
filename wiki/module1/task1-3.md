# 3. Создание локальных учётных записей

## 3.1 Создайте локальные учетные записи на серверах HQ-SRV и BR-SRV
:::details
* Создайте пользователя sshuser

* Пароль пользователя sshuser с паролем P@ssw0rd

* Идентификатор пользователя 2026

* Пользователь sshuser должен иметь возможность запускать sudo без
ввода пароля
:::

<!-- Мы люди занятые так что делаем всё одной командой -->
```shell
useradd sshuser -u 2026
```

Указываем для свежесозданного пользователя пароль следуя заданию.

```shell
passwd sshuser
```

::: info
Просто дважды вводим пароль P@ssw0rd. Он не будет отображаться при вводе из соображений безопасности, но сами символы корректно вводятся.
:::

Редактируем файл `/etc/sudoers`. Необходимо разрешить использование sudo для самого себя (root) и группе
wheel.

```text:line-numbers=115 {3,9}
## User privilege specification
##
# root ALL=(ALL:ALL) ALL # раскомментировать тут

## Uncomment to allow members of group wheel to execute any command
# WHEEL_USERS ALL=(ALL:ALL) ALL

## Same thing without a password
# WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL # и тут

## Uncomment to allow members of group sudo to execute any command
# SUDO_USERS ALL=(ALL:ALL) ALL
```

Добавляем sshuser в группу wheel дабы наделить его возможностями суперпользователя.

```shell
usermod sshuser -aG wheel
```

## 3.2 Создайте пользователя net_admin на маршрутизаторах HQ-RTR и BR-RTR

::: details
* Создайте пользователя net_admin на маршрутизаторах HQ-RTR и BR-RTR

* Пароль пользователя net_admin с паролем P@ssw0rd
:::

Необходимо предустановить sudo. В стандартной поставке ALT JeOS его нет.

```shell
apt-get update && apt-get install sudo
```

В остальном - действия аналогичны предыдущему пункту.
Единственные отличия - другое имя пользователя и отсутствие нужды указывать свой UID при его (пользователя) создании.

```shell
sudo useradd net_admin
passwd net_admin
# ...
usermod net_admin -aG wheel
```

## 3.3 Проверка работоспособности

Удостовериться в корректном выполнении задания очень просто.
У нас должна быть возможность спокойно залогиниться под созданным пользователем и выполнить от его лица что угодно с повышением привилегий.

За пример возьмём хост HQ-SRV и юзера sshuser.

```shell
sudo -iu sshuser
sudo whoami
```

Если пользователь сменился, и повышение привилегий от его имени прошло успешно не запросив ввода пароля - конфигурация выполнена верно.
