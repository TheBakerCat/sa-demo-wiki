# 3. Настройте сервер сетевой файловой системы (nfs) на HQ-SRV:

::: details Задания

• В качестве папки общего доступа выберите /raid/nfs, доступ для чтения
и записи исключительно для сети в сторону HQ-CLI

• На HQ-CLI настройте автомонтирование в папку /mnt/nfs

• Основные параметры сервера отметьте в отчёте

::: 

МАШИНА HQ-SRV

```Shell
apt-get install nfs-server -y
```
```Shell
mkdir /raid/nfs
chmod -R 777 /raid/nfs
```
Открываем файл `/etc/exports` и пишем в нем:
<!--
Возможно надо так, но у меня и без no_root_squash завелось
/raid/nfs 192.168.200.0/28(rw,no_root_squash)
-->
```
/raid/nfs 192.168.200.0/28(rw)
```
```Shell
exportfs -arv
systemctl enable --now nfs-server
```

Переходим на HQ-CLI

Прописываем в терминале

```Shell
mkdir /mnt/nfs
chmod -R 777 /mnt/nfs
```

Далее заходим в файл /etc/fstab
прописываем в новой строчке

<!--
Возможно надо так, но у меня и без ,_netdev завелось
192.168.100.2:/raid/nfs /mnt/nfs nfs defaults,_netdev 0 0
-->

```txt
192.168.100.2:/raid/nfs /mnt/nfs nfs defaults 0 0
```
после этого можем проверить подключился ли диск командой
```
df -h
```
В списке должно отобразиться хранилище с ip-адресом 192.168.100.2 


