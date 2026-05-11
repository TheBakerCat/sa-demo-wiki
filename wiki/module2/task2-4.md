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

прописываем

```
sed -i 's/^pool/#pool/' /etc/chrony.conf
```

переходим в файл `/etc/chrony.conf`

Меняет строчку local stratum 10 на local stratum 5

После чего добавляем строчки:

```
server ntp0.ntp-servers.net iburst prefer minstratum 4
allow 0.0.0.0/0
```

Перезагружаем chronyd

```
systemctl restart chronyd
```

## 2. Настройка машин

прописываем на всех машинах
```
apt-get update && apt-get install chrony -y

sed -i 's/^pool/#pool/' /etc/chrony.conf
echo "server 172.16.1.1 iburst" >> /etc/chrony.conf
systemctl restart chronyd
```

Для машин BR-RTR BR-SRV сервер будет 172.16.2.1 Для HQ-SRV HQ-CLI HQ-RTR сервер будет 172.16.1.1 соответственно

## 3. Проверка

На клиенте при команде chronyc sources должно выводить ip адрес ISP

На сервере при команде chronyc clients должно выводить ip адреса всех обоих RTR

