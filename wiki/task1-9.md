# 9. Настройте протокол динамической конфигурации хостов для сети в сторону HQ-CLI:

• Настройте нужную подсеть

• В качестве сервера DHCP выступает маршрутизатор HQ-RTR

• Клиентом является машина HQ-CLI

• Исключите из выдачи адрес маршрутизатора

• Адрес шлюза по умолчанию – адрес маршрутизатора HQ-RTR

• Адрес DNS-сервера для машины HQ-CLI – адрес сервера HQ-SRV

• DNS-суффикс – au-team.irpo

• Сведения о настройке протокола занесите в отчёт

## 9.1

установка 
~~~~
apt-get update && apt0get install dhcpd
~~~~

конф файл 

/etc/dhcp/dhcpd.conf

~~~~
sub-net 192.168."vlan".0 netmask 255.255.255.x(посмотрите какая у вас маска при такой записи, если получится табличку прикреплю)
    options routers "ip vlan"
    options subnet-mask совпадает с маской выше
    X
    X
    options domain-name-servers "ip vlan"
    range dynamic-bootp 192.168.vlan.2 192.168.vlan.10
    x
    x
~~~~
~~~~
systemctl restart dhcpd
~~~~
