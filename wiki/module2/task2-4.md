# 4. Настройте службу сетевого времени на базе сервиса chrony на маршрутизаторе ISP:

::: details Задания

• Вышестоящий сервер ntp на маршрутизаторе ISP - на выбор участника

• Стратум сервера - 5

• В качестве клиентов ntp настройте: HQ-SRV, HQ-CLI, BR-RTR, BR-SRV.

::: 

## 1. Настройка сервера 
Открываем файл /etc/chrony.conf на машине IPS

Меняет строчку local stratum 10 на local stratum 5

После чего добавляем строчки:

```
alllow 0.0.0.0/0
manual
```

Перезагружаем chronyd

```
systemctl restart chronyd
```

## 2. Настройка клиента

Открываем файл /etc/chrony.conf

После чего добавляем строчку:

```
pool "IP адресс IPS"
```

Перезагружаем chronyd

```
systemctl restart chronyd
```

Делаем тоже самой на каждой из следуйших машин: HQ-SRV, HQ-CLI, BR-RTR, BR-
SRV.

## 3. Проверка

На клиенте при команде chronyc sources должно выводить ip адрес IPS

На сервере при команде chronyc clients должно выводить ip адреса всех обоих RTR

