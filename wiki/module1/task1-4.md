# 4. Настройте коммутацию в сегменте HQ следующим образом:

Настройте адресацию на интерфейсах

::: details
* Трафик HQ-SRV должен принадлежать VLAN 100

* Трафик HQ-CLI должен принадлежать VLAN 200

* Предусмотреть возможность передачи трафика управления в VLAN 999

* Реализовать на HQ-RTR маршрутизацию трафика всех указанных VLAN 
с использованием одного сетевого адаптера ВМ/физического порта
* 
* Сведения о настройке коммутации внесите в отчёт
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

## 4.1 Создание Vlan

Создаем следующие файлы\директории:

```shell
# HQ-RTR
# etc/net/iface/br0/options

TYPE=ovsbr
HOST=ens19
BOOTPROTO=static
```

```shell
# HQ-RTR
# /etc/net/iface/vlan100/options

TYPE=ovsport
BRIDGE=br0
VID=100
BOOTPROTO=static
CONFIG_IPV4=yes
```

```shell
# HQ-RTR
# /etc/net/iface/vlan100/ipv4address

192.168.100.1/28
```

---

vlan200

```shell
# HQ-RTR
# /etc/net/iface/vlan200/options

TYPE=ovsport
BRIDGE=br0
VID=200
BOOTPROTO=static
CONFIG_IPV4=yes
```

```shell
# HQ-RTR
# /etc/net/iface/vlan200/ipv4address

192.168.200.1/29
```

---

vlan999

```shell
# HQ-RTR
# /etc/net/iface/vlan999/options

TYPE=ovsport
BRIDGE=br
VID=999
BOOTPROTO=static
CONFIG_IPV4=yes
```

```shell
# HQ-RTR
# /etc/net/iface/vlan999/ipv4address

192.168.99.1/28
```

Проверяем создались ли vlan
```shell
systemctl restart network
```

## 4.2 Клиент машины HQ-SRV  и HQ-CLI

HQ-SRV

```shell
#options 
#/etc/net/iface/ens18.100

BOOTPROTO=static
TYPE=vlan
VID=100
HOST=ens18
CONFIG_IPV4=yes
DISABLED=no
```

```shell
# HQ-SRV
# /etc/net/iface/ens18.100/ipv4address

192.168.100.2/28
```

```shell
# HQ-SRV
# /etc/net/iface/ens18.100/ipv4routes

default via 192.168.100.1
```

```shell
# HQ-SRV
# /etc/net/iface/ens18.100/resolv.conf

nameserver 8.8.8.8
```

HQ-CLI

```shell
# HQ-CLI 
# /etc/net/iface/ens18.200

BOOTPROTO=static
TYPE=vlan
VID=200
HOST=ens18
CONFIG_IPV4=yes
DISABLED=no
```

```shell
# HQ-CLI
# /etc/net/iface/ens18.200/ipv4address

192.168.200.2/29
```

```shell
# HQ-CLI
# /etc/net/iface/ens18.200/ipv4routes

default via 192.168.200.1
```

```shell
# HQ-CLI
# /etc/net/iface/ens18.200/resolv.conf

nameserver 8.8.8.8
```

Полезные материалы:
[https://www.altlinux.org/Etcnet][2]

## 4.3 Настройка openvswitch
BR-RTR

для проверки используем:
```shell
ovs-vsctl show 
```

Проверка работаспособности 
```shell
ping ya.ru -I "ip адрес vlan"
```

Полезные материалы:

* [Etcnet/openvswitch][3]

[1]: </appendix/ip_table.md>
[2]: <https://www.altlinux.org/Etcnet>
[3]: <https://www.altlinux.org/Etcnet/openvswitch>


