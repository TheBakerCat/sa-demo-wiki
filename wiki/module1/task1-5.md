# 5. Настройте безопасный удалённый доступ на серверах HQ-SRV и BR-SRV:

::: details
* Для подключения используйте порт 2026

* Разрешите подключения исключительно пользователю sshuser

* Ограничьте количество попыток входа до двух

* Настройте баннер «Authorized access only»
:::

Устанавливаем SSH-сервер, если он ещё не установлен.

```shell
apt-get update && apt-get install openssh-server
```

Все дальнейшие изменения производятся в конфигурационном файле `/etc/openssh/sshd_config` на хостах `HQ-SRV` и `BR-SRV`.

## 5.1 Настройка порта подключения

Находим строчку `#Port 22`, раскомментируем и изменяем значение на `2026`.

```python:line-numbers
Port 22 # [!code --]
Port 2026 # [!code ++]
```

## 5.2 Разрешение подключений только для sshuser

Добавляем директиву `AllowUsers` в конец файла `/etc/openssh/sshd_config`.

```txt:line-numbers
# HQ-SRV / BR-SRV
# /etc/openssh/sshd_config (в конец файла)
AllowUsers sshuser
```

::: info
Директива `AllowUsers` задаёт белый список пользователей, которым разрешено подключение по SSH. Все остальные пользователи будут автоматически отклонены.
:::

## 5.3 Ограничение количества попыток входа

Находим строчку `#MaxAuthTries 6`, раскомментируем и изменяем значение на `2`.

```python:line-numbers
MaxAuthTries 6 # [!code --]
MaxAuthTries 2 # [!code ++]
```

## 5.4 Настройка баннера «Authorized access only»

Находим строчку `#Banner none`, раскомментируем и указываем путь к файлу с текстом баннера.

```python:line-numbers
#Banner none # [!code --]
Banner /etc/openssh/banner # [!code ++]
```

Создаём файл баннера с необходимым содержимым.

```shell
echo "Authorized access only" > /etc/openssh/banner
```

## 5.5 Применение и проверка

Перезапускаем сервис SSH для применения изменений.

```shell
systemctl restart sshd
```

Для проверки пробуем подключиться с HQ-RTR к HQ-SRV по SSH.

```shell
# HQ-RTR
ssh -p 2026 sshuser@192.168.100.2
```

Если подключение прошло успешно и вы видите баннер «Authorized access only» — конфигурация выполнена верно.

__Повторите те же действия на машине BR-SRV по аналогии.__

Полезные материалы:
* [https://www.altlinux.org/SSH][1]

[1]: <https://www.altlinux.org/SSH>
