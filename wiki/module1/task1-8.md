# 8. Настройка динамической трансляции адресов маршрутизаторах HQRTR и BR-RTR:

• Настройте динамическую трансляцию адресов для обоих офисов в
сторону ISP, все устройства в офисах должны иметь доступ к сети
Интернет

Устанавливаем iptables

```shell
apt-get install iptables
```

Ставим его на автозагрузку через

```shell
systemctl enable iptables
```

Настраиваем iptables

```shell
iptables -t nat -A POSTROUTING -o "интерфейс, который направлен в интернет, обычно ens18" -j MASQUERADE
```

<!--  потом прописываешь команду , потом сохроняешься всю эту байду с помошью -->

Сохраняем настройки 

```shell
iptables-save >> /etc/sysconfig/iptables
```

Перезапускаем демон iptables, чтоб применить настройки

```shell
systemctl restart iptables.
```





