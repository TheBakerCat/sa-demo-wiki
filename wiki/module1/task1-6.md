# 6. Настройте IP-туннель между офисами HQ и BR:

::: details
* На выбор технологии GRE или IP in IP

* Сведения о туннеле занесите в отчёт
:::

В рамках руководства будем использовать GRE-туннель для связи офисов HQ и BR.

## 6.1 Настройка GRE на HQ-RTR

Создаём конфигурационные файлы для GRE-интерфейса на HQ-RTR.

```txt:line-numbers {3-9}
# HQ-RTR
# /etc/net/ifaces/GRE1/options
TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.1.2
TUNREMOTE=172.16.2.2
TUNTTL=64
TUNOPTIONS='ttl 64'
```

::: info
* `TUNLOCAL` — IP-адрес локального интерфейса, через который отправляются пакеты туннеля
* `TUNREMOTE` — IP-адрес удалённого интерфейса, на который приходят пакеты туннеля
* `HOST` — имя физического интерфейса, через который проходит туннельный трафик
:::

```txt:line-numbers {3}
# HQ-RTR
# /etc/net/ifaces/GRE1/ipv4address
10.0.0.1/30
```

## 6.2 Настройка GRE на BR-RTR

Аналогично создаём конфигурацию GRE-интерфейса на BR-RTR, зеркально поменяв адреса `TUNLOCAL` и `TUNREMOTE`.

```txt:line-numbers {3-9}
# BR-RTR
# /etc/net/ifaces/GRE1/options
TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.2.2
TUNREMOTE=172.16.1.2
TUNTTL=64
TUNOPTIONS='ttl 64'
```

```txt:line-numbers {3}
# BR-RTR
# /etc/net/ifaces/GRE1/ipv4address
10.0.0.2/30
```

Применяем сетевую конфигурацию на обеих машинах.

```shell
systemctl restart network
```

::: tip
Маршрутизация трафика между офисами через GRE-туннель будет настроена позднее, в рамках конфигурации динамической маршрутизации.
:::

## 6.3 Проверка работоспособности

Убедиться в корректной работе туннеля можно пингом между GRE-интерфейсами.

```shell
# HQ-RTR
ping 10.0.0.2
```

```shell
# BR-RTR
ping 10.0.0.1
```

Если пинг идёт — GRE-туннель работает.

Полезные материалы:
* [Etcnet: настройка IP-туннелей][1]

[1]: <https://www.altlinux.org/Etcnet#Настройка_и_использование_IP-туннелей>
