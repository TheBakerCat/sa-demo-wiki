# 9. Настройте протокол динамической конфигурации хостов для сети в сторону HQ-CLI:

::: details
• Настройте нужную подсеть

• В качестве сервера DHCP выступает маршрутизатор HQ-RTR

• Клиентом является машина HQ-CLI

• Исключите из выдачи адрес маршрутизатора

• Адрес шлюза по умолчанию – адрес маршрутизатора HQ-RTR

• Адрес DNS-сервера для машины HQ-CLI – адрес сервера HQ-SRV

• DNS-суффикс – au-team.irpo

• Сведения о настройке протокола занесите в отчёт
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

Установка 
```shell
apt-get update && apt-get install dhcpd
```

## 9.1 Служба Dhcpd на HQ-RTR

Конфигурационный файл лежит по следующему пути: `/etc/dhcp/dhcpd.conf`

```txt:line-numbers {9}
sub-net 192.168.200.0 netmask 255.255.255.248(посмотрите какая у вас маска при такой записи, если получится табличку прикреплю)
    options routers              "192.168.200.1"
    options subnet-mask          255.255.255.248
    X
    X
    options domain-name-servers "192.168.3.2"
    range dynamic-bootp 192.168.200.2 192.168.200.10
    x
    x
```

Перезапускаем службу DHCP
```shell
systemctl restart dhcpd
```

## 9.2 Настройка Dhcpd на HQ-CLI

Переходим в конфигурационный файл `etc/net/iface/ens18.200/options

```shell
#options 
#/etc/net/iface/vlan.200

BOOTPROTO=dhcp
TYPE=vlan
VID=200
HOST="ens18"
CONFIG_IPV4=yes
DISABLED=no
```


[1]: </appendix/ip_table.md>
