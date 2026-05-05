# 7. Обеспечьте динамическую маршрутизацию на маршрутизаторах HQ-RTR и BR-RTR:

::: details
* Разрешите выбранный протокол только на интерфейсах IP-туннеля

* Маршрутизаторы должны делиться маршрутами только друг с другом

* Обеспечьте защиту выбранного протокола посредством парольной
защиты

* Сведения о настройке и защите протокола занесите в отчёт
:::

В рамках руководства, будем придерживаться [этой таблицы адресации][1], ***чего и вам советуем, если вы слепо следуете руководству и не понимаете что делаете!***

В качестве протокола динамической маршрутизации будем использовать OSPF, реализованный в пакете FRR.

Устанавливаем FRR на обоих маршрутизаторах.

```shell
apt-get update && apt-get install frr
```

## 7.1 Включение демона OSPF

В файле `/etc/frr/daemons` находим строчку `ospfd=no` и меняем её на `ospfd=yes`.

```python:line-numbers
ospfd=no # [!code --]
ospfd=yes # [!code ++]
```

Включаем и добавляем FRR в автозагрузку.

```shell
systemctl enable --now frr
```

## 7.2 Конфигурация OSPF на HQ-RTR

Заходим в терминал управления FRR.

::: info
`vtysh` (Virtual TeletYpe SHell) — интерфейс управления FRR, по синтаксису аналогичный Cisco IOS.
:::

```shell
vtysh
```

Выполняем конфигурацию OSPF. Все команды ниже вводятся последовательно в терминале `vtysh`.

```txt:line-numbers
conf t

int ens18
  ip ospf passive
exit

int ens19
  ip ospf passive
exit

router ospf
 ospf router-id 1.1.1.1
 network 10.0.0.0/30 area 0
 network 192.168.100.0/28 area 0
 network 192.168.200.0/28 area 0
 network 192.168.99.0/29 area 0
exit

int GRE1
 ip ospf network point-to-point
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 P@ssw0rd
exit

do wr
end
exit
```

::: info
* `ip ospf passive` — запрещает отправку OSPF-пакетов на указанном интерфейсе, при этом сеть интерфейса всё равно анонсируется
* `ip ospf network point-to-point` — задаёт тип сети point-to-point на GRE-интерфейсе, что ускоряет установление соседства
* `ip ospf authentication message-digest` — включает MD5-аутентификацию на интерфейсе для защиты протокола
:::

## 7.3 Конфигурация OSPF на BR-RTR

Аналогично заходим в `vtysh` на BR-RTR и выполняем конфигурацию.

```shell
vtysh
```

```txt:line-numbers
conf t

int ens18
  ip ospf passive
exit

int ens19
  ip ospf passive
exit

router ospf
 ospf router-id 2.2.2.2
 network 10.0.0.0/30 area 0
 network 192.168.3.0/28 area 0
exit

int GRE1
 ip ospf network point-to-point
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 P@ssw0rd
exit

do wr
end
exit
```

::: warning
Пароль аутентификации (`message-digest-key`) должен совпадать на обоих маршрутизаторах, иначе OSPF-соседство не установится.
:::

## 7.4 Проверка работоспособности

Для проверки конфигурации и состояния OSPF используем команды в `vtysh`:

```shell
# Просмотр текущей конфигурации
vtysh -c "show running-config"
```

```shell
# Просмотр OSPF-соседей
vtysh -c "show ip ospf neighbor"
```

```shell
# Просмотр таблицы маршрутизации
vtysh -c "show ip route"
```

Если в выводе `show ip ospf neighbor` отображается сосед в состоянии `Full` — OSPF-соседство установлено, маршрутизация работает.

[1]: </appendix/ip_table.md>
