# 4. Настройте коммутацию в сегменте HQ следующим образом:

• Трафик HQ-SRV должен принадлежать VLAN 100

• Трафик HQ-CLI должен принадлежать VLAN 200

• Предусмотреть возможность передачи трафика управления в VLAN 999

• Реализовать на HQ-RTR маршрутизацию трафика всех указанных VLAN

с использованием одного сетевого адаптера ВМ/физического порта

• Сведения о настройке коммутации внесите в отчёт

## 4.1 Создание Vlan

HQ-RTR
Создаем следующие файлы\директории:

HQ-SW

```shell
#options
#etc/net/iface/HQ-SW/options
TYPE=ovsbr
```

vlan100

```shell
#options
#/etc/net/iface/vlan100/options
TYPE=ovsport
BRIDGE=HQ-SW
VID=100
BOOTPROTO=static
```

```shell
#ipv4address
#/etc/net/iface/vlan100/ipv4address
192.168.100.1/28
```

vlan200

```shell
#options
#/etc/net/iface/vlan200/options
TYPE=ovsport
BRIDGE=HQ-SW
VID=200
BOOTPROTO=static
```

```shell
#ipv4address
#/etc/net/iface/vlan200/ipv4address
192.168.200.1/29
```

vlan999

```shell
#options
#/etc/net/iface/vlan999/options
TYPE=ovsport
BRIDGE=HQ-SW
VID=999
BOOTPROTO=static
```

```shell
#ipv4address
#/etc/net/iface/vlan999/ipv4address
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
#/etc/net/iface/vlan.100

BOOTPROTO=static
TYPE=vlan
VID=100
HOST=`ens18`
CONFIG_IPV4=yes
DISABLED=no
```

```shell
#ipv4address

#/etc/net/iface/vlan.100/ipv4address
192.168.100.2/28
```

```shell
#ipv4route
#/etc/net/iface/vlan.100/ipv4routes

default via 192.168.100.1
```

```shell
#resolv.conf
#/etc/net/iface/vlan.100/resolv.conf

nameserver 8.8.8.8
```

HQ-CLI

```shell
#options 
#/etc/net/iface/vlan.200

BOOTPROTO=static
TYPE=vlan
VID=200
HOST="ens18"
CONFIG_IPV4=yes
DISABLED=no
```

```shell
#ipv4address
#/etc/net/iface/vlan.200/ipv4address

192.168.200.2/29
```

```shell
#ipv4route
#/etc/net/iface/vlan.200/ipv4routes

default via 192.168.200.1
```

```shell
#resolv.conf
#/etc/net/iface/vlan.200/resolv.conf

nameserver 8.8.8.8
```

Полезные материалы:
[https://www.altlinux.org/Etcnet][1]

## 4.2Настройка openvswitch
BR-RTR
Установка openvswitch
```shell
apt-get update && apt-get install openvswitch
```

Помещаем в автозагрузки
```shell
systemctl enable --now openvswitch
```

идем к файлу `/etc/net/iface/default/options` и находим строчку `OVS_REMOVE=yes` и меняем yes на no

```shell
echo "8021q" | tee -a /etc/modules
```


```shell
ovs-vsctl add-port HQ-SW ens19 trunk=100,200,999
```

для проверки используем:
```shell
ovs-vsctl show 
```

Проверка работаспособности 
```shell
ping ya.ru -I "ip адрес vlan"
```

Полезные материалы:
[https://www.altlinux.org/Etcnet/openvswitch][2]


[1]: <https://www.altlinux.org/Etcnet>
[2]: <https://www.altlinux.org/Etcnet/openvswitch>


