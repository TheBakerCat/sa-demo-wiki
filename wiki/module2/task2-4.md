# 4. Настройте службу сетевого времени на базе сервиса chrony на маршрутизаторе ISP:

::: details Задания

• Вышестоящий сервер ntp на маршрутизаторе ISP - на выбор участника

• Стратум сервера - 5

• В качестве клиентов ntp настройте: HQ-SRV, HQ-CLI, BR-RTR, BR-SRV.

::: 

## 1. Настройка сервера 
Открываем файл /etc/chrony.conf на машине ISP

скачиваем

```Shell
apt-get install chrony -y
```
<!--
прописываем

```
sed -i 's/^pool/#pool/' /etc/chrony.conf
```
-->

переходим в файл `/etc/chrony.conf`

Меняет строчки

```python:line-numbers
local stratum 10 # [!code --]
local stratum 5 # [!code ++]
```

Перезагружаем chronyd

```
systemctl restart chronyd
```

## 2. Настройка машин

прописываем на всех машинах

```python:line-numbers
apt-get update && apt-get install chrony -y
```

редактируем  /etc/chrony.conf

Комментируем

```python:line-numbers
pool pool.ntp.org iburst # [!code --]
#pool pool.ntp.org iburst # [!code ++]
```
Добавляем строки

```python:line-numbers
server 172.16.1.1 iburst
```

Перезагружаем chronyd

```python:line-numbers
systemctl restart chronyd
```

Для машин BR-RTR BR-SRV сервер будет 172.16.2.1 Для HQ-SRV HQ-CLI HQ-RTR сервер будет 172.16.1.1 соответственно

## 3. Проверка

На клиенте при команде chronyc sources должно выводить ip адрес ISP

На сервере при команде chronyc clients должно выводить ip адреса всех обоих RTR

