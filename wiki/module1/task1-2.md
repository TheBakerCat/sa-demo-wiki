# 2. Настройте доступ к сети Интернет, на маршрутизаторе ISP:

Настройте адресацию на интерфейсах

::: details
• Интерфейс, подключенный к магистральному провайдеру, получает
адрес по DHCP

• Настройте маршрут по умолчанию, если это необходимо

• Настройте интерфейс, в сторону HQ-RTR, интерфейс подключен к сети
172.16.1.0/28

• Настройте интерфейс, в сторону BR-RTR, интерфейс подключен к сети
172.16.2.0/28
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

## 2.1 Конфигурируем подключение к WAN на ISP

При выполнении вами задания, наименования интерфейсов на машинах и сети, к которым они подключены, могут отличаться от использованных в данном руководстве.

Вы можете получить информацию о интерфейсах на машине с помощью `ip a`.

::: details
::: info
Мы же, в рамках данного задания, договоримся использовать:

* `ens18` в качестве интерфейса в сторону WAN
* `ens19` в качестве интерфейса в сторону офиса HQ
* `ens20` в качестве интерфейса в сторону офиса BR

:::

В первую очередь, нам необходимо включить IP Forwarding. 
Если пропустить этот шаг что угодно требующее пересылки пакетов между сетевыми интерфейсами работать __НЕ БУДЕТ__

Редактируем файл по пути `/etc/net/sysctl.conf` на хосте `ISP`

```python:line-numbers
# IPv4 packet forwarding.
#
# This variable is special, its change resets all configuration
# parameters to their default state (RFC 1122 for hosts, RFC 1812 for
# routers).
#
net.ipv4.ip_forward = 0 # [!code --]
net.ipv4.ip_forward = 1 # [!code ++]

#
# Source validation by reversed path, as specified in RFC 1812.
```

Сразу же конфигурируем интерфейс `ens18`. Получать ip и gateway он будет по DHCP.

```txt:line-numbers {3-7}
# ISP
# /etc/net/ifaces/ens18/options
TYPE=eth
CONFIG_IPV4=yes
CONFIG_WIRELESS=no
DISABLED=no
BOOTPROTO=dhcp
```

И указываем публичные доменные сервера для корректного разрешения доменных имён.

```text:line-numbers {3}
# ISP
# /etc/net/ifaces/ens18/resolv.conf
nameserver 77.88.8.8
```

Применяем обновлённую сетевую конфигурацию
```shell
systemctl restart network
```

Проверяем наличие доступа к репозиториям дистрибутива. Если доступа нет, значит в ходе выполнения был допущен косяк.

## 2.2 Конфигурация сети в сторону офиса HQ
::: details
::: info
Для конфигурации сети на машине HQ-RTR будут использоваться следующие обозначения:

* `ens18` - интерфейс в сторону ISP
* `ens19` - интерфейс для коммутации
:::

В первую очередь конфигурируем интерфейс `ens19` на стороне `ISP`. Делается это подобным образом:

```txt:line-numbers {3-7}
# ISP
# /etc/net/ifaces/ens19/options
TYPE=eth
CONFIG_IPV4=yes
CONFIG_WIRELESS=no
DISABLED=no
BOOTPROTO=static
```

::: tip
В `options` есть несколько обязательных для указания параметров вроде `TYPE` или `BOOTPROTO`.

Полностью ознакомиться со всеми параметрами, которые используются в `options` для конфигурации сетевых интерфейсов, можно на [этой странице][2].
:::

```   txt:line-numbers {3}
# ISP
# /etc/net/ifaces/ens19/ipv4address
172.16.1.1/28
```
::: info
Конфигурация статических IPv4 адресов для `etcnet` всегда происходит в файле `ipv4address` необходимого сетевого интерфейса. 
:::

---

Конфигурируем `ens18` на стороне HQ-RTR подобным образом.
```txt:line-numbers {3-7}
# HQ-RTR
# /etc/net/ifaces/ens18/options
TYPE=eth
CONFIG_IPV4=yes
CONFIG_WIRELESS=no
DISABLED=no
BOOTPROTO=static
```

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/ens18/ipv4address
172.16.1.1/28
```

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/ens18/ipv4route
default via 172.16.1.1
```

:::info
В файле `ipv4route` можно указывать любые статические маршруты.

Однако, в рамках ДЭ мы настраиваем динамическую маршрутизацию, потому тут мы конфигурируем только default gateway маршруты.
:::

```text:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/ens18/resolv.conf
nameserver 77.88.8.8
```

::: info
В файле `resolv.conf` мы конфигурируем сервера доменных имён, к которым будет обращаться наш системный резолвер.

Сервер доменных имён не обязательно должен быть публичным. Далее в заданиях мы будем конфигурировать сервер доменных имён нашей организации.

Почитать подробнее про `resolv.conf` можно [тут][3].
:::

## 2.3 Конфигурация сети в сторону офиса BR
::: details
::: info
Для конфигурации сети на машине BR-RTR будут использоваться следующие обозначения:

* `ens18` - интерфейс в сторону ISP
* `ens19` - интерфейс в сторону BR-SRV
:::

Производим конфигурацию сети ISP-BR по аналогии с конфигурацией сети ISP-HQ.

```txt:line-numbers {3-7}
# ISP
# /etc/net/ifaces/ens20/options
TYPE=eth
CONFIG_IPV4=yes
CONFIG_WIRELESS=no
DISABLED=no
BOOTPROTO=static
```

```   txt:line-numbers {3}
# ISP
# /etc/net/ifaces/ens20/ipv4address
172.16.2.1/28
```

---

```txt:line-numbers {3-7}
# BR-RTR
# /etc/net/ifaces/ens18/options
TYPE=eth
CONFIG_IPV4=yes
CONFIG_WIRELESS=no
DISABLED=no
BOOTPROTO=static
```

```txt:line-numbers {3}
# BR-RTR
# /etc/net/ifaces/ens18/ipv4address
172.16.2.2/28
```

```txt:line-numbers {3}
# BR-RTR
# /etc/net/ifaces/ens18/ipv4route
default via 172.16.2.1
```

```text:line-numbers {3}
# BR-RTR
# /etc/net/ifaces/ens18/resolv.conf
nameserver 77.88.8.8
```

## 2.4 Конфигурация Masquerade на ISP

Для конфигурации DNAT на ISP нам потребуется межсетевой экран.
В рамках руководства будем использовать iptables. Для выполнения заданий его возможностей нам хватит с головой.

Ставим пакет iptables

```shell
apt-get update && apt-get install iptables
```

Создаём правило DNAT в таблице `nat`, цепочке `POSTROUTING` для интерфейса `ens18`.

```shell
iptables -t nat -A POSTROUTING -o ens18 -j MASQUERADE
```

Ввиду того, что по-умолчанию iptables хранит правила только в оперативной памяти,
их необходимо вручную сохранить и добавить в автозагрузку демон, применяющий их при запуске ОС.

Сохраняем правила iptables в файл по пути `/etc/sysconfig/iptables`

```shell
iptables-save > /etc/sysconfig/iptables
```

Добавляем демон `iptables` в автозагрузку нашей системы инициализации.

```shell
systemctl enable iptables
```

# 2.5 Проверяем сетевую связанность

Если конфигурация сетевых устройств в сетях ISP-HQ и ISP-BR выполнена корректно,
каждая машина должна успешно "пинговать" каждого участника сети.

К примеру, пошлём несколько ICMP пакетов с хоста HQ-RTR на хост BR-RTR

```shell
# HQ-RTR
ping 172.16.2.2
```

Если пинг идёт, поздравляю - сетевая связанность присутствует.

---

Так же, все 3 машины должны иметь доступ к репозиториям дистрибутива.

Проверить это очень легко - достаточно просто попробовать синхронизировать список пакетов

```shell
apt-get update
```

[1]: </appendix/ip_table.md>
[2]: <https://www.opennet.ru/cgi-bin/opennet/man.cgi?topic=etcnet-options&category=5>
[3]: <https://www.opennet.ru/docs/RUS/tcp_conf/tcp07.html>




