# 10. Настройте инфраструктуру разрешения доменных имён для офисов HQ и BR:

::: details
* Основной DNS-сервер реализован на HQ-SRV

* Сервер должен обеспечивать разрешение имён в сетевые адреса
устройств и обратно в соответствии с таблицей 3

* В качестве DNS-сервера пересылки используйте любой общедоступный
DNS-сервер (77.88.8.7, 77.88.8.3 или другие)
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

Устанавливаем BIND на HQ-SRV.

```shell
apt-get install bind bind-utils
```

## 10.1 Конфигурация options.conf

Редактируем файл `/etc/bind/options.conf`.

::: info
Этот же файл доступен по пути `/var/lib/bind/etc/bind/options.conf`.
:::

```txt:line-numbers {3-15}
# HQ-SRV
# /etc/bind/options.conf
options {
    directory "/etc/bind/zone";
    listen-on { 127.0.0.1; 192.168.100.0/28; };
    forwarders { 77.88.8.8; };
    recursion yes;
    allow-query { any; };
    dnssec-validation no;
};
```

## 10.2 Конфигурация зон

Редактируем файл `/etc/bind/local.conf` для объявления прямой и обратной зон.

```txt:line-numbers {3-14}
# HQ-SRV
# /etc/bind/local.conf
zone "au-team.irpo" {
    type master;
    file "au-team.irpo.db";
};

zone "100.168.192.in-addr.arpa" {
    type master;
    file "100.168.192.in-addr.arpa.db";
};

zone "200.168.192.in-addr.arpa" {
    type master;
    file "200.168.192.in-addr.arpa.db";
};
```

## 10.3 Файл прямой зоны

Создаём файл прямой зоны `/etc/bind/zone/au-team.irpo.db`.

```txt:line-numbers {3-18}
# HQ-SRV
# /etc/bind/zone/au-team.irpo.db
$TTL 1D
@       IN      SOA     hq-srv admin.au-team.irpo. (
                        2026042401      ; serial
                        1H              ; refresh
                        30M             ; retry
                        1W              ; expire
                        1D )            ; minimum
;

@       IN      NS      hq-srv.au-team.irpo.
hq-rtr  IN      A       192.168.100.1
hq-srv  IN      A       192.168.100.2
br-rtr  IN      A       192.168.3.1
br-srv  IN      A       192.168.3.2
hq-cli  IN      A       192.168.200.2
```

::: tip
Конкретные записи (A-записи) и их IP-адреса должны соответствовать таблице 3 из задания. Сверьтесь с вашей таблицей адресации.
:::

## 10.4 Файл обратной зоны

Создаём файл обратной зоны `/etc/bind/zone/100.168.192.in-addr.arpa.db`.

```txt:line-numbers {3-14}
# HQ-SRV
# /etc/bind/zone/100.168.192.in-addr.arpa.db
$TTL 1D
@       IN      SOA     hq-srv.au-team.irpo. admin.au-team.irpo. (
                        2026042401      ; serial
                        1H              ; refresh
                        30M             ; retry
                        1W              ; expire
                        1D )            ; minimum
;
@       IN      NS      hq-srv.au-team.irpo.
1       IN      PTR     hq-rtr.au-team.irpo.
2       IN      PTR     hq-srv.au-team.irpo.
```

## 10.5 Применение и проверка

Включаем и добавляем BIND в автозагрузку.

```shell
systemctl enable --now bind
```

Проверяем корректность конфигурации.

```shell
named-checkconf
```

```shell
named-checkzone au-team.irpo /var/lib/bind/zone/au-team.irpo.db
```

Проверяем разрешение имён.

```shell
# HQ-SRV
dig @127.0.0.1 hq-srv.au-team.irpo
```

Если в ответе присутствует правильный IP-адрес — DNS-сервер настроен корректно.

::: tip
Не забудьте на всех машинах обновить `resolv.conf`, указав HQ-SRV в качестве DNS-сервера:

```
nameserver 192.168.100.2
```
:::

[1]: </appendix/ip_table.md>
