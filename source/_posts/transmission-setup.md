---
title: transmission安装和配置
date: 2020-07-27 15:30:21
categories:
  - 技术
tags:
  - transmission
---

稍微记录下安装过程，以供日后参考

<!--more-->

# 安装Transmission

输入以下命令安装`transmission-daemon`

```
sudo apt update
sudo apt upgrade
sudo apt install transmission-daemon
```

# 配置Transmission

Transmission在安装完之后是自动运行的，要修改配置必须先停止对应的service

```
sudo systemctl stop transmission-daemon
```

然后打开配置文件修改

```
sudo nano /etc/transmission-daemon/settings.json
```

其实也没啥要改的，没特殊需求的话，大部分选项都完全不用动。感觉一般只需要修改下面几个。

## download-dir

下载完成的保存路径，默认/var/lib/transmission-daemon/downloads，如果在树莓派上外挂硬盘可以改成/media/pi/HARD_DRIVE_NAME

## rpc-username

rpc连接用户名，用于登录Web UI，默认值为transmission，可以随意改

## rpc-password

rpc连接密码，用于登录Web UI，默认值为transmission，建议修改

## rpc-whitelist

rpc连接白名单，需要`rpc-whitelist-enabled`为`true`才生效。默认值是`127.0.0.1`，只能本地连接。如果要局域网内连接可以改成`192.168.*.*`。

# 启动transmission

首先用下面命令启动transmission。

```
sudo systemctl start transmission-daemon
```

然后访问`ip_address:9091`，输入刚才设置的`rpc-username`和`rpc-password`就可以看到Web UI了。

# 替换Web UI

由于自带的Web UI比较简陋，所以可以考虑替换成开源的[transmission-web-control](https://github.com/ronggang/transmission-web-control)。

执行下面的命令，就装完了，还是很方便的~

```
wget https://github.com/ronggang/transmission-web-control/raw/master/release/install-tr-control-cn.sh
sudo bash install-tr-control-cn.sh
```