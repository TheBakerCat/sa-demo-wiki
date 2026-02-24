# 5. Настройте безопасный удаленный доступ на серверах HQ-SRV и BR-SRV:

::: details
• Для подключения используйте порт 2026

• Разрешите подключения исключительно пользователю sshuser

• Ограничьте количество попыток входа до двух

• Настройте баннер «Authorized access only».
:::

Установка ssh сервера:

```shell
apt-get update && apt-get install openssh-server
```

## 1.1 Настройка подключения с порта 2026

Найдите строчку `port 22` раскомментируйте и измените на нужный `port 2026`
Редактируем файл по пути `/etc/openssh/sshd_config` на хосте `HQ-SRV`

```python:line-numbers

#port 22 # [!code --]
port 2026 # [!code ++]

```


## 1.2 Разрешите подключения исключительно пользователю sshuser

Прописываем строчку `AllowUsers sshuser` в файле `/etc/openssh/sshd_config` на хосте `HQ-SRV`

```shell
AllowUsers sshuser
```

## 1.3 Ограничьте количество попыток входа до двух

Для ограничения попыток ввода пароля нужно найти строчку с `#MaxAuthTries 6` в файле `/etc/openssh/sshd_config` на хосте `HQ-SRV` раскомментировать и изменить значение

```python:line-numbers

#MaxAuthTries 6 # [!code --]
MaxAuthTries 2 # [!code ++]

```

## 1.4 Настройте баннер «Authorized access only».

Для настройки баннера найдите в rонфигурационном файле строчку `#Banner` раскомментируйте и пропишите путь к файлу `/root/banner`, где будет лежать «Authorized access only»

Создаем файл banner

```shell
touch /root/banner
```
Используя текстовый редактор прописываем Authorized access only

```shell
vim /root/banner

Authorized access only

```

Для проверки попробуйте с HQ-RTR подключиться по ssh sshuser@192.168.100.2

__Повторите те же действия на машине BR-SRV по аналогии__

Полезные материалы:
~~~~
https://www.altlinux.org/SSH
~~~~







