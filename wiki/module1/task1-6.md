# 6. Между офисами HQ и BR, на маршрутизаторах HQ-RTR и BR-RTR необходимо сконфигурировать ip туннель:

::: details
• На выбор технологии GRE или IP in IP

• Сведения о туннеле занесите в отчёт.
:::

## 6.1 Настройка GRE на HQ-RTR

Создаем в директории /etc/net/iface другую директорию с названием нашего GRE туннеля (например GRE1)


```shell
mkdir /etc/net/iface/GRE1
```

Переходим в сделанную директорию и создаем:

```shell
cd /etc/net/iface/GRE1
```

Создаем конфигурационные файлы для GRE

```shell
touch options ipv4address ipv4route
```

Настройка GRE

```shell
#options
#/etc/net/iface/GRE1/options

TYPE=iptun
TUNTYPE=gre
TUNLOCAL="172.16.1.2" #ip адрес интерфейса от которого отправляется пакет
TUNREMOTE="172.16.2.2" #ip адрес интерфейса, который получает пакет
TUNTTL=64
HOST="ens18"
TUNOPTIONS='ttl64'
```
В ipv4address прописываем:

```shell
#ipv4address
#/etc/net/iface/GRE1/ipv4address

10.0.0.1/30
```
(ip адрес интерфейса GRE на которой сейчас работаете)

В ipv4route прописываем:

```shell
#ipv4route
#/etc/net/iface/GRE1/ipv4route

10.0.0.2/30
```
(ip адрес интерфейса GRE до которого идет пакет)

## 6.2 Настройка GRE на BR-RTR

Создаем в директории /etc/net/iface другую директорию с названием нашего GRE туннеля (например GRE1)


```shell
mkdir /etc/net/iface/GRE1
```

Переходим в сделанную директорию и создаем:

```shell
cd /etc/net/iface/GRE1
```

Создаем конфигурационные файлы для GRE

```shell
touch options ipv4address ipv4route
```

Настройка GRE

```shell
#options
#/etc/net/iface/GRE1/options

TYPE=iptun
TUNTYPE=gre
TUNLOCAL="172.16.2.2" #ip адрес интерфейса от которого отправляется пакет
TUNREMOTE="172.16.1.2" #ip адрес интерфейса, который получает пакет
TUNTTL=64
HOST="интерфейс в сторону isp"
TUNOPTIONS='ttl64'
```
В ipv4address прописываем:

```shell
#ipv4address

#/etc/net/iface/GRE1/ipv4address
10.0.0.2/30
```
(ip адрес интерфейса GRE на которой сейчас работаете)

В ipv4route прописываем:

```shell
#ipv4route

#/etc/net/iface/GRE1/ipv4route
10.0.0.1/30
```
(ip адрес интерфейса GRE до которого идет пакет)

Полезные материалы:
[https://www.altlinux.org/Etcnet#Настройка_и_использование_IP-туннелей][1]

[1]: <https://www.altlinux.org/Etcnet#Настройка_и_использование_IP-туннелей>








