# 9. Настройте протокол динамической конфигурации хостов для сети в сторону HQ-CLI:

::: details
* Настройте нужную подсеть

* В качестве сервера DHCP выступает маршрутизатор HQ-RTR

* Клиентом является машина HQ-CLI

* Исключите из выдачи адрес маршрутизатора

* Адрес шлюза по умолчанию – адрес маршрутизатора HQ-RTR

* Адрес DNS-сервера для машины HQ-CLI – адрес сервера HQ-SRV

* DNS-суффикс – au-team.irpo

* Сведения о настройке протокола занесите в отчёт
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

Устанавливаем DHCP-сервер на HQ-RTR.

```shell
apt-get install dhcp-server
```

## 9.1 Конфигурация DHCP-сервера на HQ-RTR

Редактируем конфигурационный файл `/etc/dhcp/dhcpd.conf`. За основу можно взять пример из `/etc/dhcp/dhcpd.conf.sample`.

```txt:line-numbers {3-12}
# HQ-RTR
# /etc/dhcp/dhcpd.conf
subnet 192.168.200.0 netmask 255.255.255.248 {
    option routers 192.168.200.1;
    option subnet-mask 255.255.255.248;
    option domain-name "au-team.irpo";
    option domain-name-servers 192.168.100.2;
    range 192.168.200.2 192.168.200.6;
}
```

::: info
* `option routers` — адрес шлюза по умолчанию (HQ-RTR)
* `option domain-name-servers` — адрес DNS-сервера (HQ-SRV)
* `option domain-name` — DNS-суффикс
* `range` — диапазон выдаваемых адресов. Адрес маршрутизатора (`192.168.200.1`) исключён из диапазона
:::

Перезапускаем и добавляем в автозагрузку службу DHCP.

```shell
systemctl enable --now dhcpd
```

## 9.2 Настройка DHCP-клиента на HQ-CLI

На машине HQ-CLI меняем тип получения адреса с `static` на `dhcp` в конфигурации VLAN-интерфейса.

```txt:line-numbers {3-8}
# HQ-CLI
# /etc/net/ifaces/ens18.200/options
BOOTPROTO=dhcp
TYPE=vlan
VID=200
HOST=ens18
CONFIG_IPV4=yes
DISABLED=no
```

::: tip
Файлы `ipv4address` и `ipv4route` для интерфейса `ens18.200` на HQ-CLI больше не нужны — адрес, шлюз и DNS теперь выдаются по DHCP. Их можно удалить.
:::

Перезапускаем сетевую службу.

```shell
systemctl restart network
```

## 9.3 Проверка работоспособности

Проверяем, что HQ-CLI получил адрес по DHCP.

```shell
# HQ-CLI
ip a show ens18.200
```

Если интерфейс получил адрес из диапазона `192.168.200.2–192.168.200.6` — DHCP работает корректно.

[1]: </appendix/ip_table.md>
