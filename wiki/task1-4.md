# 4. Настройте коммутацию в сегменте HQ следующим образом:

• Трафик HQ-SRV должен принадлежать VLAN 100

• Трафик HQ-CLI должен принадлежать VLAN 200

• Предусмотреть возможность передачи трафика управления в VLAN 999

• Реализовать на HQ-RTR маршрутизацию трафика всех указанных VLAN

с использованием одного сетевого адаптера ВМ/физического порта

• Сведения о настройке коммутации внесите в отчёт

## 4.1 Создание Vlan

HQ-SW/options

options
~~~
TYPE=ovsbr
~~~

vlan

options
~~~
TYPE=ovsport
BRIDGE=HQ-SW
VID=100 или 200 или 999
BOOTPROTO=static
~~~

ipv4address
~~~
192.168."номер vlan"."номер машины"/"маска по заданию"
~~~

~~~~
systemctl restart network
~~~~

## 4.2Настройка openvswitch

Установка openvswitch
~~~~
apt-get update && apt-get install openvswitch
~~~~

~~~~
systemctl enable --now openvswitch
~~~~

идем к файлу /etc/net/iface/default/options и находим строчку OVS_REMOVE=yes и меняем yes на no

~~~~
echo "8021q" | tee -a /etc/modules
~~~~

~~~~
ovs-vsctl add-port HQ-SW "интерфейс" trunk=100,200,999
~~~~

для проверки используем:
~~~~
ovs-vsctl show 
~~~~

Проверка работаспособности 
~~~~
ping ya.ru -I "ip адрес vlan"
~~~~
Если есть ping, значит серверная часть сделана правильно. 

переходим на клиентскую систему

создаем директории для vlan пример ens18.100
для ускорения конфигурации можно скопировать конфиг из ens18

options
~~~~
TYPE=vlan
VID=100 или 200
HOST="интерфейс, который ведет к серверу"
BOOTPROTO=static
CONFIG_IPV4=yes
~~~~

ipv4address
~~~~
192.168."номер vlan"."номер машины"/"маска по заданию"
~~~~

ipv4route
~~~~
default via "ip адрес нужного vlan на стороне openvswitch"
~~~~

resolv.conf
~~~~
nameserver 8.8.8.8
~~~~

~~~~
systemctl restart network
~~~~

Проверяем:
~~~~
ping ya.ru
~~~~

создаем директории для vlan пример ens18.100
для ускорения конфигурации можно скопировать конфиг из ens18

options
~~~~
TYPE=vlan
VID=100 или 200
HOST="интерфейс, который ведет к серверу"
BOOTPROTO=static
CONFIG_IPV4=yes
~~~~

ipv4address
~~~~
192.168."номер vlan"."номер машины"/"маска по заданию"
~~~~

ipv4route
~~~~
default via "ip адрес нужного vlan на стороне openvswitch"
~~~~

resolv.conf
~~~~
nameserver 8.8.8.8
~~~~

~~~~
systemctl restart network
~~~~

Проверяем:
~~~~
ping ya.ru
~~~~




