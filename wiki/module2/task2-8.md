## 8. На маршрутизаторах сконфигурируйте статическую трансляцию портов:

• Пробросьте порт 8080в порт приложения testapp BR-SRV на
маршрутизаторе BR-RTR, для обеспечения работы приложения testapp
извне

• Пробросьте порт 8080в порт веб приложения на HQ-SRV на
маршрутизаторе HQ-RTR, для обеспечения работы веб приложения
извне

• Пробросьте порт 2026на маршрутизаторе HQ-RTR в порт 2026сервера
HQ-SRV, для подключения к серверу по протоколу ssh из внешних сетей

• Пробросьте порт 2026на маршрутизаторе BR-RTR в порт 2026сервера
BR-SRV, для подключения к серверу по протоколу ssh из внешних сетей.

Вспоминаем классику

Начнем с машины HQ-RTR
```Shell
iptables -t nat -A PREROUTING -i ens18 -p tcp --dport 2026 -j DNAT --to-destination 192.168.100.2:2026
iptables -t nat -A PREROUTING -i ens18 -p tcp --dport 8080 -j DNAT --to-destination 192.168.100.2:80
```

Для сохранения правил используем itables-save но уже без перезаписи
```Shell
iptables-save >> /etc/sysconfig/iptables
```
Машина BR-RTR
```Shell
iptables -t nat -A PREROUTING -i ens18 -p tcp --dport 2026 -j DNAT --to-destination 192.168.100.2:2026
iptables -t nat -A PREROUTING -i ens18 -p tcp --dport 8080 -j DNAT --to-destination 192.168.100.2:8080
```
Если вы набедокурили с сохранениями, вписали не ту команду перепутали POSTROUTING с PREROUTING
Вы всегда можете удалить нужные вам правила, для начала выведем список всех iptables правил:
```Shell
iptables -t nat -L -n -v
```
Находим по списку ненужные правила и удаляем их
```Shell
iptables -t nat -D PREROUTING 1
```
после удаления номера сдвигаются так-что будьте аккуратнее
