## 5. Сконфигурируйте ansible на сервере BR-SRV:

• Сформируйте файл инвентаря, в инвентарь должны входить HQ-SRV,
HQ-CLI, HQ-RTR и BR-RTR

• Рабочий каталог ansible должен располагаться в /etc/ansible

• Все указанные машины должны без предупреждений и ошибок отвечать
pong на команду ping в ansible посланную с BR-SRV.

## 1. Необходимо установить пакет ansible и sshpass, выполнить это можно следующей командой:

```
apt-get update && apt-get install –y ansible sshpass
```

## 2. Приведем файл инвентаря Ansible к следующему виду, отредактировав конфигурационный файл по пути /etc/ansible/hosts любым удобным текстовым редактором, например vim или nano:

```
br-rtr ansible_ssh_host=192.168.1.1 ansible_ssh_user=net_admin ansible_ssh_pass=P@ssword
hq-rtr ansible_ssh_host=172.16.1.2 ansible_ssh_user=net_admin ansible_ssh_pass=P@ssword
hq-srv ansible_ssh_host=192.168.100.2 ansible_ssh_user=sshuser ansible_ssh_pass=P@ssword ansible_ssh_port=2026
hq-cli ansible_ssh_host=192.168.200.2 ansible_ssh_user=Administrator@au-team.irpo ansible_ssh_pass=P@ssword
```

## 2.1 Редактируем файл /etc/ansible/ansible.cfg, чтобы отключить проверку ключа хоста при подключении по SSH:

Находим строчку "host_key_checking = False" и раскоментируем ёё

```
#host_key_checking = False >> host_key_checking = False
```


## 2.2 Как проверить?:

```
ansible all -m ping
```

Если у вас выводит кучу красного текста, необходимо перезапустить ssh на всех машинках котроые указаны в ansible.cfg

```
systemctl restart sshd
```

также стоит проверить правильность написание хостов, 
при пинге будет понятно с каким хостом у вас проблемы, 
идите дальше только когда на каждые 4 пинга получите в ответ "понг"

### 5.1

Доп материалы:
~~~~
https://labex.io/ru/tutorials/ansible-ansible-installation-on-ubuntu-67172
~~~~
