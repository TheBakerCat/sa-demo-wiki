# Настройте контроллер домена Samba DC на сервере BR-SRV:

::: details Задания

* Имя домена au-team.irpo

* Введите в созданный домен машину HQ-CLI

* Создайте 5 пользователей для офиса HQ: имена пользователей формата hquser№ (например hquser1, hquser2 и т.д.)

* Создайте группу hq, введите в группу созданных пользователей

* Убедитесь, что пользователи группы hq имеют право аутентифицироваться на HQ-CLI

* Пользователи группы hq должны иметь возможность повышать
привилегии для выполнения ограниченного набора команд: cat, grep, id.
Запускать другие команды с повышенными привилегиями пользователи
группы права не имеют.

:::
## 1. Подготовка к запуску и первичная настройка Samba на BR-SRV

Устанавливаем samba

```python:line-numbers
apt-get install task-samba-dc -y
```
Прописываем следующие команды:
```python
rm -f  /etc/samba/smb.conf
rm -rf /var/lib/samba/
rm -rf /var/cache/samba/
mkdir -p /var/lib/samba/sysvol
```
Меняем DNS
```
cd /etc/net/ifaces/ens18
vim resolv.conf
nameserver 127.0.0.1
```

Запускаем программу настройки

```
samba-tool domain provision
```

Псоле этого программа будет просить ввести параметры

```
Realm: au-team.irpo
```

Далее пропускаем всё с помощью Enter, кроме строчки DNS forwarder ip address и Administrator password 

```
Domain [au-team]:

Server Role (dc, member, standalone) [dc]:

DNS backend (SAMBA_INTERNAL, BIND9_FLATFILE, BIND9_DLZ, NONE) [SAMBA_INTERNAL]:
```
прописываем здесь адрес любого публичного DNS сервера(1.1.1.1 или 8.8.8.8 или 77.88.8.8)
```
DNS forwarder IP address (write 'none' to disable forwarding) [127.0.0.1]: "адрес DNS сервера"
```
когда доходит до ввода пароля, вписываем P@ssw0rd два раза

далее настраиваем kerberos
```Shell
cp /var/lib/samba/private/krb5.conf /etc/krb5.conf

overwrite: y
```

Ставим программу на автозапуск и запускаем

```
 systemctl enable --now samba
```
прописываем в `/etc/net/ifaces/ens18/resolv.conf`
```Shell
search au-team.irpo
nameserver 127.0.0.1
```
в `/etc/samba/smb.conf` будет прописан forwarders на HQ-SRV так что bind из-за этого не сломается

```Shell
systemctl restart network
```



создаём группу пользователей hq

```Shell
samba-tool group add hq
```

создаём и добавляем пользователей в группу 

скрипт для автоматического создания
```Shell
for i in {1..5}; do
>samba-tool user add hquser$i P@ssw0rd;
>samba-tool user setexpiry hquser$i --noexpiry;
>samba-tool group addmembers "hq" hquser$i;
>done

если при создании пользователей не будет никаких ошибок то вы все прописали правильно
проверить можно с помощью команд:

```Shell
samba-tool group listmembers hq
kinit Administrator
klist
```

Далее в hq-rtr заходим в конфигурационный файл `/etc/dhcp/dhcpd.conf`
меняем здесь:
```python:line-numbers
# See dhcpd.conf(5) for further configuration

ddns-update-style none;

subnet 192.168.200.0 netmask 255.255.255.240 {
    option routers                  192.168.200.1;
    option subnet-mask              255.255.255.240;

    option nis-domain               "domain.org";
    option domain-name              "au-team.irpo";
    option domain-name-servers      192.168.100.2; # [!code --]
    option domain-name-servers      192.168.3.2; # [!code ++]

    range dynamic-bootp 192.168.200.2 192.168.200.7;
    default-lease-time 21600;
    max-lease-time 43200;
}
```

Чтобы настройки применились перезапускаем службу dhcpd

```Shell
systemctl restart dhcpd
```

## 2. Введение в созданный домен машину HQ-CLI

соответственно для того чтобы HQ-CLI нашла контроллер домена, нужно перезапустить службу network

```Shell
systemctl restart network
```
Далее:

Заходим на HQ-CLI --> Меню(снизу слева) --> Раздел Приложения --> Администрирование --> Центр управления системой --> Раздел Пользователи --> Аутентификация

Выбираем пункт Домен Active Directory

Вводим au-team.irpo в поле Домен

Листаем вниз и нажимаем применить

далее нужно прописать права для пользователей группы hq
```Shell
roleadd hq wheel
```

далее заходим в файл по пути nano /etc/sudoers.d/hq


вставляем в этот файл
```Shell
Cmnd_Alias SHELLCMD = /bin/cat, /bin/grep, /usr/bin/id  
  
WHEEL_USERS ALL=(ALL:ALL) SHELLCMD
```
на этом конфигурация samba ⚡⚡⚡ВСЁ⚡⚡⚡


