# 3. Создайте локальные учетные записи на серверах HQ-SRV и BR-SRV:

• Создайте пользователя sshuser

• Пароль пользователя sshuser с паролем P@ssw0rd

• Идентификатор пользователя 2026
<!-- Мы люди занятые так что делаем всё одной командой -->
```
sudo useradd -u 1500 -p P@ssw0rd sshuser
```
• Пользователь sshuser должен иметь возможность запускать sudo без
ввода пароля

Добавляем пользователя в группу

```
usermod -aG wheel sshuser
```

В файле /etc/sudoers добовляем строчку любым удобным методом(nano, vim, echo, gedit)

```
sshuser ALL=(ALL) NOPASSWD: ALL
```
• Создайте пользователя net_admin на маршрутизаторах HQ-RTR и BR-
RTR

• Пароль пользователя net_admin с паролем P@ssw0rd

```
sudo useradd -p P@ssw0rd net_admin
```

• При настройке ОС на базе Linux, запускать sudo без ввода пароля
Добавляем пользователя в группу

```
usermod -aG wheel net_admin
```

В файле /etc/sudoers добовляем строчку любым удобным методом(nano, vim, echo, gedit)

```
net_admin ALL=(ALL) NOPASSWD: ALL
```

• При настройке ОС отличных от Linux пользователь должен обладать
максимальными привилегиями.
