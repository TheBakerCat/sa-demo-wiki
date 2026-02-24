# 7. Обеспечьте динамическую маршрутизацию на маршрутизаторах HQRTR и BR-RTR:

Cети одного офиса должны быть доступны из другого
офиса и наоборот. Для обеспечения динамической маршрутизации
используйте link state протокол на усмотрение участника:

:::details
• Разрешите выбранный протокол только на интерфейсах ip туннеля

• Маршрутизаторы должны делиться маршрутами только друг с другом

• Обеспечьте защиту выбранного протокола посредством парольной
защиты

• Сведения о настройке и защите протокола занесите в отчёт.
:::

Установка 
```shell
apt-get update && apt-get install ffr
```

## 7.1 Настройка ffr (ospf)

В файле `/etc/frr/daemons` находим строчку `ospfd=no` и меняем ее на `ospfd=yes`

```shell
#/etc/frr/daemons

ospfd=no # [!code --]
ospfd=yes # [!code ++]

```

Запускаем и ставим на автозагрузку frr

```shell
systemctl enable --now frr
```

Заходим в терминал управления frr - vtysh (Расшифровываетсья как Virtual TeletYpe SHell)

```shell
vtysh
```

Переходим в режим конфигурации

```shell
conf t
```

Переходим в режим конфигурации виртуального роутера ospf

```shell
router ospf
```

На HQ-RTR прописываем:

```shell
ospf router-id 1.1.1.1
```

На BR-RTR прописываем:

```shell
ospf router-id 2.2.2.2
```

Далее на всех интерфейсах, кроме `GRE1` прописываем значение `passives`, на самом `GRE1` прописываем `point-to-point`:

```shell
int "интерфейс"
```

```shell
ip ospf passive
```

```shell
int "GRE"
```

```shell
ip ospf network point-to-point  
```

Прописываем сети, которые будут работать в GRE1

```shell
network "интерфейс GRE с вашей стороны вместе с маской" area 0
network "ip сети vlan 100 вместе с маской" area 0
network "ip сети vlan 200 вместе с маской" area 0
network "ip сети vlan 999 вместе с маской" area 0
```

~~~~
do wr
~~~~

~~~~
end
~~~~

~~~~
exit
~~~~














