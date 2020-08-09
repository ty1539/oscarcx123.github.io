---
title: Manjaro XFCE 安装和调教
categories:
  - 技术
tags:
  - Linux
date: 2020-08-09 01:47:55
permalink: 
---

这两天终于下定决心再次转投Manjaro，顺手记录下安装踩坑调教全过程。

<!--more-->

# 坑爹的Win10

首先当然还是要吐槽下win10啦，各位不想看的可以直接跳到下一部分～

最开始是笔记本长时间无操作会锁屏，重新解锁之后，WIFI就会莫名其妙的丢失连接。当时感觉问题也不大，也就是手动点两下重新连接WIFI的事，所以也没想着换系统。

前一阵子搭建了NAS，然后发现其它设备都可以匿名访问，唯独Win10要求输入帐号密码。输入就输入吧，然后又发现每次启动之后都会提示“无法重新连接所有网络驱动器“，然后又得重新输入帐号密码。网上搜了一圈，发现在v2ex已经有[讨论帖](https://www.v2ex.com/t/214955)。仔细一看，居然是2015年就已经出现的bug，硬生生拖了5年，终于在win10 （ver 2004)修复了。

既然修复了，那就去更新系统呗。Windows Update吭哧吭哧忙活半天，也没有给我更新到ver 2004，只是升级到了ver 1909。一进系统我就发现File Explorer不对劲，上面的地址栏都可以跑马了，感情这是越更新越丑啊。刚刚好那天下午需要打印一点文件，然后就发现这次更新直接把Print Spooler服务给搞瘫痪了。只要我一试图打印，Print Spooler服务就会自动关闭。最后弄的没办法了，开了个虚拟机来完成打印的。

打印完我就在想，win10是越来越不靠谱了啊，看来是时候尝试下Linux单系统了。

我用Linux断断续续也有两三年了，不过那会儿一直都是双系统。最开始用的是Ubuntu 16.04，后来又尝试过Raspbian (Buster)和Manjaro。要说印象最好的应该就是Manjaro了，没有繁琐的配置，但是作为滚动发行版又可以用到最新的软件，还是挺香的。

所以就这么拍板决定用Manjaro了～

# Manjaro下载安装

Manjaro有好几个自带不同[DE](https://wiki.archlinux.org/index.php/Desktop_environment)的版本，都可以在[下载页面](https://manjaro.org/download/)找到。我个人偏向xfce，因为相对比较轻量，而且之前用的树梅派也是xfce。

下载`.iso`文件还是相当容易的，如果直接下载比较慢的话，可以通过种子来下载。

当然，下载完镜像之后还需要制作启动盘，一般都用[Rufus](https://rufus.ie/)，准备个U盘就行了。

但是我手头没U盘，咋办？这里我用的是`DriveDroid`这个app来把拥有root权限的安卓手机变成启动盘。只需要把Manjaro镜像文件拷进去，然后挂载，就可以当启动盘用了，还是相当方便的。

安装基本上就是一路确定，然后swap分区可以不给，因为现在物理内存已经足够大了。办公套件可以先选择不装，毕竟LibreOffice使用体验确实不咋地，打开中文文档的时候感觉卡顿特别严重。

# sudo免密码

每次`sudo`都要输入密码挺烦的，不过sudo免密码会降低安全性，这个各位自己衡量

输入下面命令来打开sudoers，这里编辑器指定为nano，因为简单好用

```
sudo EDITOR=nano visudo
```

在sudoers文件的最后，加上下面这句，这里需要把`your_username`替换成自己的用户名

```
your_username ALL=(ALL) NOPASSWD: ALL
```

# 更新软件包

基本上装完系统第一件事就是先更新各类软件包，这个指令要跑好一会儿

```
sudo pacman -Syu --noconfirm
```

# 安装工具

我一般会安装这些工具：
* neofetch：展示系统信息
* tldr：可以快速查命令的常用方法，man的简易替代版，懒人专属
* you-get：下载视频必备工具，直接贴视频网站的链接就行
* aria2：多线程下载工具
* yay：（必备）AUR的包管理器

```
sudo pacman -S --noconfirm neofetch tldr you-get aria2 yay
```

# 安装输入法

这里直接推荐新版的[fcitx5](https://wiki.archlinux.org/index.php/Fcitx5_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))，原来的fcitx就不要再用了。

```
sudo pacman -S --noconfirm fcitx5
sudo pacman -S --noconfirm fcitx5-qt
sudo pacman -S --noconfirm fcitx5-gtk
sudo pacman -S --noconfirm fcitx5-chinese-addons
yay -S --noconfirm fcitx5-pinyin-zhwiki
```

因为暂时还没有GUI的配置工具，只能手动修改配置了

切记：在修改任何配置之前，确保fcitx5已经退出，懒人可以运行下面的命令

```
kill $(ps aux | grep '[f]citx5' | awk '{print $2}')
```

激活输入法就是`Ctrl` + `Space`，输入法切换就是熟悉的`Ctrl` + `Shift`，在中文输入法下可以用`Left Shift`临时切到英文

嗯，先把参考文章放这儿了，毕竟fcitx5的配置都是互相抄，全都一个模子刻出来的，所以我下面列出的配置也都是抄来的

fcitx5配置参考文章：
* [在Manjaro上优雅地使用Fcitx5 - DotIN13](https://www.wannaexpresso.com/2020/03/26/fcitx5/)
* [尝试Fcitx5 - 千玄洞](https://zjukuny.github.io/posts/fcitx5/)
* [配置Fcitx5输入法, 肥猫百万词库就是赞 - ManateeLazyCat](https://manateelazycat.github.io/linux/2020/06/19/fcitx5-is-awesome.html)

## 设置开机启动

Settings > Session and Startup > Application Autostart，点击add就可以填写内容添加了。下面是我填写的内容，仅供参考

```
Name: fcitx5
Description: 拼音输入法
Command: fcitx5 > /dev/null 2>&1
Trigger: on login
```

## 修改配置文件

把下面内容复制到`~/.config/fcitx5/profile`

```
[Groups/0]
# Group Name
Name=Default
# Layout
Default Layout=us
# Default Input Method
DefaultIM=pinyin

[Groups/0/Items/0]
# Name
Name=keyboard-us
# Layout
Layout=

[Groups/0/Items/1]
# Name
Name=pinyin
# Layout
Layout=

[GroupOrder]
0=Default
```

## 修改环境变量

在`~/.xprofile`添加如下内容

```
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS="@im=fcitx5"
```

## 修改GUI配置

在`~/.config/fcitx5/conf/classicui.conf`添加如下内容

```
# 按屏幕 DPI 使用
PerScreenDPI=False

# Font (设置成你喜欢的字体)
Font="Noto Sans Regular 14"
```

## 关闭云拼音

为了防止泄露隐私，最好还是关闭云拼音

在`~/.config/fcitx5/conf/pinyin.conf`添加如下内容

```
# Enable Cloud Pinyin
CloudPinyinEnabled=False
```

## 修改主题

看了一圈，一堆教程都推荐[Fcitx5-Material-Color](https://github.com/hosxy/Fcitx5-Material-Color)，看图例感觉还不错，于是依葫芦画瓢装个试试。安装方法在repo的Readme已经写的很清楚了，我就不赘述了。

# 安装常用软件

## Linux原生软件

我一般会安装这些软件：
* Google Chrome：谷歌浏览器的同步还是很方便的
* Filezilla：开源的文件传输软件
* WPS Office：比开源的LibreOffice好用多了
    * wps-office-mui-zh-cn：WPS中文语言包
    * wps-office-fonts：方正字体
    * ttf-wps-fonts：数学公式字体
* Telegram：里头很多Manjaro大佬
* Discord：聊游戏专用
* Virtualbox：开源的虚拟机

```
yay -S --noconfirm google-chrome
sudo pacman -S --noconfirm filezilla
yay -S --noconfirm wps-office wps-office-mui-zh-cn wps-office-fonts ttf-wps-fonts
sudo pacman -S --noconfirm telegram-desktop
sudo pacman -S --noconfirm discord
linux_kernel_ver=$(mhwd-kernel -li | grep -oP 'linux\d+' | head -n 1)
sudo pacman -S --noconfirm virtualbox $linux_kernel_ver-virtualbox-host-modules
sudo gpasswd -a $USER vboxusers
```

## QQ & Wechat

QQ和微信这两个一直都不太好搞，目前看来基本有三套方案。

最容易的就是直接在Virtualbox里头跑完整的系统，然后使用seamless mode（Right Ctrl + H），不过视觉效果看起来不太好，QQ周围会有一圈Windows的背景。

要么就是用`deepin-wine`来解决，各种小毛病挺多的（比如无法记住密码），不过能用。AUR上面有大佬打包好的，基本上是开箱即用。

当然也可以用官方发布的Linux版QQ，不过UI十分简陋，梦回十年前。不过最麻烦的问题，还是不能用帐号密码登录，必须要用手机扫码，不知道用意何在。

这里重点说下`deepin-wine`方案。

安装之后，分别找到如下路径中的`run.sh`文件

```
/opt/deepinwine/apps/Deepin-WeChat
/opt/deepinwine/apps/Deepin-TIM
```

然后在`run.sh`文件头部的`WINE_CMD="wine"`下面添加如下代码

```
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS="@im=fcitx5"
```

启动之后如果觉得字体太小，那就先退出QQ/微信，然后在终端运行下面代码

```
env WINEPREFIX="$HOME/.deepinwine/Deepin-TIM" winecfg
```

在弹出来的wine设置面板中找到显示 > 屏幕分辨率，修改dpi即可

## 汉化包

这些汉化包其实装不装都行的，感觉平时也很少用这几个软件

```
sudo pacman -S --noconfirm firefox-i18n-zh-cn
sudo pacman -S --noconfirm thunderbird-i18n-zh-cn
sudo pacman -S --noconfirm gimp-help-zh_cn
```

# 配置编程环境

基本上我会安装这些东西：
* R
* Java（jre-openjdk，maven）
* JS（nodejs，npm）
* GitHub桌面版：鼠标点点点就可以commit和push
* Unity3d
* Android Studio
* VSCode

```
yay -S --noconfirm r
sudo pacman -S --noconfirm jre-openjdk maven
sudo pacman -S --noconfirm nodejs npm
yay -S --noconfirm github-desktop-bin
unity_version="2019.4.7f1"
yay -S --noconfirm unityhub
unityhub --headless install --version $unity_version
yay -S --noconfirm android-studio
sudo pacman -S --noconfirm code
```

其中VSCode还是需要更进一步的配置

VSCode的配置文件在~/.config/Code - OSS/User/settings.json，这里给出我的配置

```
{
    "files.autoSave": "afterDelay",
    "editor.fontSize": 18,
    "editor.wordWrap": "on",
    "window.zoomLevel": 0.25
}
```

当然插件是必不可少的，这里直接通过命令行安装，省事儿

```
code --install-extension ms-ceintl.vscode-language-pack-zh-hans
code --install-extension ms-python.python
code --install-extension ms-dotnettools.csharp
code --install-extension unity.unity-debug 
code --install-extension kleber-swf.unity-code-snippets
code --install-extension ms-vscode.cpptools
code --install-extension ikuyadeu.r
code --install-extension vscjava.vscode-java-pack
```

# 打印机

Manjaro自带[CUPS](https://wiki.archlinux.org/index.php/CUPS_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))（Common Unix Printing System），可以直接通过Web UI来进行管理，不过这里用命令行就更快更方便。

下面以我的打印机Brother HL-L2320D为例，各位自行替换成自己的型号。

首先，我们需要准备ppd文件（打印机描述文件）。Manjaro自带了很多来自Foomatic和Gutenprint的ppd文件，所以执行下面命令先看看有没有。

```
lpinfo -m | grep "HL-L2320D"
```

如果有那就万事大吉，没有也没关系，这时候去AUR看看有没有别人构建好的ppd文件。我运气还不错，已经有现成的可以下载。如果AUR也没有，那么就要自行提取ppd文件了，兄弟打印机的提取方法可以看[Packaging Brother printer drivers - Arch Wiki](https://wiki.archlinux.org/index.php/Packaging_Brother_printer_drivers)

```
yay -S --noconfirm brother-hll2320d
```

搞定ppd文件之后，再执行刚才的`lpinfo`命令就能看到ppd文件的路径了

```
$ lpinfo -m | grep "HL-L2320D"
lsb/usr/cupsfilters/brother-HLL2320D-cups-en.ppd Brother HL-L2320D for CUPS
```

接下来只需要指定打印机名称，地址和ppd路径，就搞定了，比如输入像下面这样的命令

```
printername="HL-L2320D"
printer_url="socket://192.168.1.1:9100"
ppd_dir="lsb/usr/cupsfilters/brother-HLL2320D-cups-en.ppd"
lpadmin -p $printername -E -v $printer_url -m $ppd_dir
```

到这里打印机就已经搞定了，不过如果要进一步设置打印选项，可以使用`lpoptions -l`查看可设置项目。下面给出一例，实际可设置项目很多，这里篇幅所限只节选部分输出。

```
$ lpoptions -l
Duplex/Duplex: DuplexTumble DuplexNoTumble *None
```

上面这个是双面打印的相关设置，默认是关闭的，这里我们要用下面命令打开

```
lpadmin -p HL-L2320D -o Duplex=DuplexNoTumble
```

这个地方有个大坑，正确方法当然是用`lpadmin`，错误方法是使用`lpoptions`。因为我们是要在GUI环境下打印，所以只有通过`lpadmin`修改，其它程序才能看到。`lpoptions`也可以跟同样的参数修改，不过只能被`lp`和`lpr`这类基于命令行的打印程序看到。

大坑参考的是[Setting CUPS defaults with lpoptions vs web interface
](https://unix.stackexchange.com/questions/339205/setting-cups-defaults-with-lpoptions-vs-web-interface)

CUPS的命令行管理文档可以看[Command-Line Printer Administration](https://www.cups.org/doc/admin.html)

# 触摸板

Manjaro双指滑动的方向跟Windows是相反的，而且触摸板轻按无效。好在这些配置可以随意改。

在 Settings > Mouse and Touchpad 可以找到键鼠相关设置，然后在Device下拉菜单那里选中自己的触摸板。在Buttons and Feedback栏目勾选Reverse scroll direction，然后在Touchpad栏目勾选Tap touchpad to click，就搞定了。

# 设置时钟

## 个性化时间日期显示

打开Clock的设置，居然不能直接从GUI设置24小时制，这怎么能忍？好在可以自定义格式，左下角有个[Help](https://docs.xfce.org/xfce/xfce4-panel/4.14/clock)，可以看到时间日期格式清单。

这里我使用的是`%F %R`，等价于`%Y-%m-%d %H:%M`。

## 修正时区问题

这个问题我记得是Linux和Windows看待电脑硬件时间的方式不太一样。如果时区正确设置但是时间仍然不对，运行下面命令就好了

```
sudo timedatectl set-ntp 1
```

# 修正终端字体间距问题

这个问题好像是只有用中文系统才会看到，英文系统是正常的。反正安装文泉驿字体就能解决了。

```
sudo pacman -S --noconfirm wqy-microhei
```

# 小结

目前要调教的地方基本上就这么多，后续有发现新的内容会继续更新。

前面全部使用用命令行调教是有原因的，就是为了搞一键装机脚本。