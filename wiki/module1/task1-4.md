# 4. Настройте коммутацию в сегменте HQ следующим образом:

Настройте адресацию на интерфейсах

::: details
* Трафик HQ-SRV должен принадлежать VLAN 100

* Трафик HQ-CLI должен принадлежать VLAN 200

* Предусмотреть возможность передачи трафика управления в VLAN 999

* Реализовать на HQ-RTR маршрутизацию трафика всех указанных VLAN 
с использованием одного сетевого адаптера ВМ/физического порта
* Сведения о настройке коммутации внесите в отчёт
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

## 4.1 Настройка Open vSwitch

Устанавливаем пакет `openvswitch` на HQ-RTR.

```shell
apt-get install openvswitch
```

Включаем и добавляем сервис в автозагрузку.

```shell
systemctl enable --now openvswitch
```

Для проверки используем:

```shell
ovs-vsctl show
```

## 4.2 Создание VLAN на HQ-RTR

Создаём конфигурационные файлы сетевых интерфейсов для OVS-моста и VLAN'ов на HQ-RTR.

### Мост br0

```txt:line-numbers {3-5}
# HQ-RTR
# /etc/net/ifaces/br0/options
TYPE=ovsbr
HOST=ens19
BOOTPROTO=static
```

### VLAN 100

```txt:line-numbers {3-7}
# HQ-RTR
# /etc/net/ifaces/vlan100/options
TYPE=ovsport
BRIDGE=br0
VID=100
BOOTPROTO=static
CONFIG_IPV4=yes
```

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/vlan100/ipv4address
192.168.100.1/28
```

### VLAN 200

```txt:line-numbers {3-7}
# HQ-RTR
# /etc/net/ifaces/vlan200/options
TYPE=ovsport
BRIDGE=br0
VID=200
BOOTPROTO=static
CONFIG_IPV4=yes
```

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/vlan200/ipv4address
192.168.200.1/29
```

### VLAN 999

```txt:line-numbers {3-7}
# HQ-RTR
# /etc/net/ifaces/vlan999/options
TYPE=ovsport
BRIDGE=br0
VID=999
BOOTPROTO=static
CONFIG_IPV4=yes
```

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/vlan999/ipv4address
192.168.99.1/28
```

Применяем обновлённую сетевую конфигурацию и проверяем, что VLAN'ы создались.

```shell
systemctl restart network
```

```shell
ovs-vsctl show
```

## 4.3 Конфигурация клиентских машин HQ-SRV и HQ-CLI

<!--
ПРИМЕЧАНИЕ

Чтоб на клиенте всё завелось, нужен интерфейс ens18 с TYPE=eth, иначе vlan, ака ens18.X00 не заведётся
-->

На клиентских машинах HQ-SRV и HQ-CLI настраиваем VLAN-интерфейсы, чтобы трафик попадал в соответствующий VLAN.

### HQ-SRV

```txt:line-numbers {3-8}
# HQ-SRV
# /etc/net/ifaces/ens18.100/options
BOOTPROTO=static
TYPE=vlan
VID=100
HOST=ens18
CONFIG_IPV4=yes
DISABLED=no
```

```txt:line-numbers {3}
# HQ-SRV
# /etc/net/ifaces/ens18.100/ipv4address
192.168.100.2/28
```

```txt:line-numbers {3}
# HQ-SRV
# /etc/net/ifaces/ens18.100/ipv4route
default via 192.168.100.1
```

```txt:line-numbers {3}
# HQ-SRV
# /etc/net/ifaces/ens18.100/resolv.conf
nameserver 8.8.8.8
```

### HQ-CLI

```txt:line-numbers {3-8}
# HQ-CLI
# /etc/net/ifaces/ens18.200/options
BOOTPROTO=static
TYPE=vlan
VID=200
HOST=ens18
CONFIG_IPV4=yes
DISABLED=no
```

```txt:line-numbers {3}
# HQ-CLI
# /etc/net/ifaces/ens18.200/ipv4address
192.168.200.2/29
```

```txt:line-numbers {3}
# HQ-CLI
# /etc/net/ifaces/ens18.200/ipv4route
default via 192.168.200.1
```

```txt:line-numbers {3}
# HQ-CLI
# /etc/net/ifaces/ens18.200/resolv.conf
nameserver 8.8.8.8
```

Применяем конфигурацию на обеих машинах.

```shell
systemctl restart network
```

<!--
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
-->

## 4.4 Проверка работоспособности

Убедиться в корректной работе VLAN'ов можно обычным пингом между машинами.

К примеру, пошлём ICMP пакеты с HQ-SRV на шлюз VLAN 100:

```shell
# HQ-SRV
ping 192.168.100.1
```

Если пинг идёт - коммутация настроена верно.

Полезные материалы:
* [https://www.altlinux.org/Etcnet][2]
* [Etcnet/openvswitch][3]

[1]: </appendix/ip_table.md>
[2]: <https://www.altlinux.org/Etcnet>
[3]: <https://www.altlinux.org/Etcnet/openvswitch>
