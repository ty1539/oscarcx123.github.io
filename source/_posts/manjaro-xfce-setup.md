---
title: Manjaro XFCE 安装和调教
date: 2020-08-09 01:47:55
categories:
  - 技术
tags:
  - Linux
---
这两天终于下定决心再次转投Manjaro，顺手记录下安装踩坑调教全过程。

最后更新时间：2020-08-29

<!--more-->

# 坑爹的Win10

首先当然还是要吐槽下win10啦，各位不想看的可以直接跳到下一部分～

最开始是笔记本长时间无操作会锁屏，重新解锁之后，WIFI就会莫名其妙的丢失连接。当时感觉问题也不大，也就是手动点两下重新连接WIFI的事，所以也没想着换系统。

前一阵子搭建了NAS，然后发现其它设备都可以匿名访问，唯独Win10要求输入帐号密码。输入就输入吧，然后又发现每次启动之后都会提示“无法重新连接所有网络驱动器”，然后又得重新输入帐号密码。网上搜了一圈，发现在v2ex已经有[讨论帖](https://www.v2ex.com/t/214955)。仔细一看，居然是2015年就已经出现的bug，硬生生拖了5年，终于在win10 （ver 2004)修复了。

既然修复了，那就去更新系统呗。Windows Update吭哧吭哧忙活半天，也没有给我更新到ver 2004，只是升级到了ver 1909。一进系统我就发现File Explorer不对劲，上面的地址栏都可以跑马了，感情这是越更新越丑啊。刚刚好那天下午需要打印一点文件，然后就发现这次更新直接把Print Spooler服务给搞瘫痪了。只要我一试图打印，Print Spooler服务就会自动关闭。最后弄的没办法了，开了个虚拟机来完成打印的。

打印完我就在想，win10是越来越不靠谱了啊，看来是时候尝试下Linux单系统了。

我用Linux断断续续也有两三年了，不过那会儿一直都是双系统。最开始用的是Ubuntu 16.04，后来又尝试过Raspbian (Buster)和Manjaro。要说印象最好的应该就是Manjaro了，没有繁琐的配置，但是作为滚动发行版又可以用到最新的软件，还是挺香的。

所以就这么拍板决定用Manjaro了～

# Manjaro下载安装

Manjaro有好几个自带不同[DE](https://wiki.archlinux.org/index.php/Desktop_environment)的版本，都可以在[下载页面](https://manjaro.org/download/)找到。我个人偏向xfce，因为相对比较轻量，而且之前用的树梅派也是xfce。据说kde也很不错，兼顾了特效、功能、轻量，用的人也挺多，有兴趣的可以试试，我是不想折腾了。

下载`.iso`文件还是相当容易的，如果直接下载比较慢的话，可以通过种子来下载。

当然，下载完镜像之后还需要制作启动盘，一般都用[Rufus](https://rufus.ie/)，准备个U盘就行了。

但是我手头没U盘，咋办？这里我用的是`DriveDroid`这个app来把拥有root权限的安卓手机变成启动盘。只需要把Manjaro镜像文件拷进去，然后挂载，就可以当启动盘用了，还是相当方便的。

安装基本上就是一路确定，如果用不到休眠（hibernate），那么swap分区可以不给。办公套件建议先选择不装，毕竟LibreOffice使用体验确实不咋地，打开中文文档的时候感觉卡顿特别严重。安装完成之后可以去下载WPS，体验吊打LibreOffice。

# sudo免密码

每次`sudo`都要输入密码挺烦的，不过sudo免密码（NOPASSWD）会极大的降低安全性，这个各位自己衡量。

输入下面命令来打开sudoers，这里编辑器指定为nano，因为简单好用。

```
sudo EDITOR=nano visudo
```

接下来有两种处理方式，可以根据自己喜好选择。

## 给自己免密码

这个方案就特别简单粗暴，不过仅对自己有效，如果是多用户的话就得写很多行。

在sudoers文件的最后，加上下面这句，这里需要把`<YOUR_USERNAME>`替换成自己的用户名。

```
<YOUR_USERNAME> ALL=(ALL) NOPASSWD: ALL
```

## 给wheel组免密码

这个方案比较一劳永逸，修改一次之后就不需要再动sudoers文件了。

首先需要把自己加入wheel组，不过这一步Manjaro已经代劳了，可以通过下面任意一条命令确认是否如此。

```bash
# 查看wheel用户组的成员
cat /etc/group | grep wheel

# 查看自己在哪些用户组
groups $(whoami)
```

然后把下面这行取消注释，这样以后还有其他用户要免密码的话，可以直接把用户添加到wheel用户组就可以了。

```
%wheel ALL=(ALL) NOPASSWD: ALL
```

# 更新软件包

基本上装完系统第一件事就是先更新各类软件包，这个指令要跑好一会儿。

```
sudo pacman -Syu --noconfirm
```

# 安装工具

我一般会安装这些工具：
* neofetch：展示系统信息
* tldr：精简版man page，懒人专属
* you-get：下载视频必备工具，直接贴视频网站的链接就行
* aria2：多线程下载工具
* yay：（必备）AUR的包管理器

```
sudo pacman -S --noconfirm neofetch tldr you-get aria2 yay
```

pacman不会用的话，直接输入`tldr pacman`就可以看到最常见的用法了，压根不用看又臭又长的man page。

悄悄说一声，如果一个命令不知道是干啥的，可以使用`whatis`命令查询，返回的结果是man page的NAME部分。

# 字体配置

## 修正终端字体间距

这个问题好像是只有用中文系统才会看到，英文系统是正常的。反正换个字体就好了，比如安装文泉驿字体。

```
sudo pacman -S --noconfirm wqy-microhei
```

## 查看可用字体

已安装的字体可以通过`fc-list`配合`grep`来查找。如果你确定安装了某个字体但是没找到，可以用`fc-cache -f -v`刷新字体缓存。下面给出搜索`文泉驿`字体的例子

```bash
$ fc-list | grep -i Micro
/usr/share/fonts/wenquanyi/wqy-microhei/wqy-microhei.ttc: WenQuanYi Micro Hei,文泉驛微米黑,文泉驿微米黑:style=Regular
/usr/share/fonts/wenquanyi/wqy-microhei/wqy-microhei.ttc: WenQuanYi Micro Hei Mono,文泉驛等寬微米黑,文泉驿等宽微米黑:style=Regular
```

## 全局emoji支持

fcitx5是支持emoji的输入的，但是试图在Chrome地址栏输入emoji会显示为黑框，所以需要配置全局emoji的支持。

先安装noto-fonts-emoji，命令如下

```
sudo pacman -S --noconfirm noto-fonts-emoji
```

创建`/etc/fonts/local.conf`并写入如下内容

注意：对于sans-serif，这里首选的是Noto Sans CJK SC而不是参考文章中所给出的Noto Sans。老外不用中文，所以配置不能直接照抄，否则可能会出现莫名其妙的问题。例如在用Mono来运行C# WinForm程序的时候，SystemFonts.DefaultFont.Name就会是Noto Sans而不是Noto Sans CJK SC，从而导致汉字全都显示成方框。

```
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>

 <alias>
   <family>sans-serif</family>
   <prefer>
     <family>Noto Sans CJK SC</family>
     <family>Noto Color Emoji</family>
     <family>Noto Emoji</family>
     <family>DejaVu Sans</family>
   </prefer> 
 </alias>

 <alias>
   <family>serif</family>
   <prefer>
     <family>Noto Serif</family>
     <family>Noto Color Emoji</family>
     <family>Noto Emoji</family>
     <family>DejaVu Serif</family>
   </prefer>
 </alias>

 <alias>
  <family>monospace</family>
  <prefer>
    <family>Noto Mono</family>
    <family>Noto Color Emoji</family>
    <family>Noto Emoji</family>
   </prefer>
 </alias>

</fontconfig>
```

然后在Settings > Appearance > Fonts 把字体设置为Noto Sans CJK SC Regular就可以了。

参考文章：[Tutorial: How to enable system-wide color emoji support](https://forum.manjaro.org/t/tutorial-how-to-enable-system-wide-color-emoji-support/35188)

# 安装输入法（fcitx5）

这里直接推荐新版的[fcitx5](https://wiki.archlinux.org/index.php/Fcitx5_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))，原来的fcitx就不要再用了。

首先安装fcitx5全家桶（fcitx5，fcitx5-qt，fcitx5-gtk，fcitx5-configtool）。

```
sudo pacman -S --noconfirm fcitx5-im
```

然后安装中文输入法和zhwiki词库。

```
sudo pacman -S --noconfirm fcitx5-chinese-addons
yay -S --noconfirm fcitx5-pinyin-zhwiki
```

推荐通过带GUI的fcitx5-configtool来修改配置，因为所见即所得，而且下面的内容也可以直接跳过不看。我配置的时候还没有fcitx5-configtool，所以下面记录了手动配置过程。

切记：在修改任何配置之前，确保fcitx5已经退出，懒人可以运行下面的命令。（其实还可以直接右键点击右下角托盘图标，然后退出）

```
kill $(ps aux | grep '[f]citx5' | awk '{print $2}')
```

激活输入法就是`Ctrl` + `Space`，输入法切换就是熟悉的`Ctrl` + `Shift`，在中文输入法下可以用`Left Shift`临时切到英文。

嗯，先把参考文章放这儿了，毕竟fcitx5的配置都是互相抄，全都一个模子刻出来的，所以我下面列出的配置大部分也都是抄来的。

fcitx5配置参考文章：
* [在Manjaro上优雅地使用Fcitx5 - DotIN13](https://www.wannaexpresso.com/2020/03/26/fcitx5/)
* [尝试Fcitx5 - 千玄洞](https://zjukuny.github.io/posts/fcitx5/)
* [配置Fcitx5输入法, 肥猫百万词库就是赞 - ManateeLazyCat](https://manateelazycat.github.io/linux/2020/06/19/fcitx5-is-awesome.html)

## 设置开机启动

Settings > Session and Startup > Application Autostart，点击add就可以填写内容添加了。下面是我填写的内容，仅供参考。

```
Name: fcitx5
Description: 拼音输入法
Command: nohup fcitx5 > /dev/null 2>&1 &
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
# 按屏幕 DPI 使用（如果多屏输入法窗口大小不一样就改成False）
PerScreenDPI=True

# Font (设置成你喜欢的字体)
Font="Noto Sans CJK SC 16"
```

## 云拼音

看到一堆教程都在担心泄露隐私，然而只依赖本地词库的效果确实不理想，zh-wiki百万词库也有很多覆盖不到的词组，所以我还是开启了云拼音。

在`~/.config/fcitx5/conf/pinyin.conf`可以找到如下内容

```
# Enable Cloud Pinyin
CloudPinyinEnabled=True
```

不过所有教程对于云拼音都是一笔带过，毕竟都是你抄我我抄你，因此这里只能自力更生了。这个云拼音最好搞清楚到底是咋回事，到时候真的如众多参考文章所说的那样直播打字可不行，所以这种情况直接看源码就是最直接的了。fcitx5自带拼音的repo是[fcitx5-chinese-addons](https://github.com/fcitx/fcitx5-chinese-addons)，云拼音相关的代码在fcitx5-chinese-addons/modules/cloudpinyin，其中需要重点关注下cloudpinyin.h和cloudpinyin.cpp。

在cloudpinyin.h中我找到了下面这段代码，看起来云拼音支持`Google`、`GoogleCN`和`Baidu`，而且默认选用`GoogleCN`。看上去还可以通过`Ctrl+Alt+Shift+C`来开关云拼音，而且云拼音要在输入至少四个字母的时候才会生效。配置项很明显是Backend，然而这个东西应该放哪儿还不知道，所以接着看代码。

```cpp
FCITX_CONFIG_ENUM(CloudPinyinBackend, Google, GoogleCN, Baidu);
FCITX_CONFIGURATION(
    CloudPinyinConfig,
    fcitx::Option<fcitx::KeyList> toggleKey{
        this,
        "Toggle Key",
        _("Toggle Key"),
        {fcitx::Key("Control+Alt+Shift+C")}};
    fcitx::Option<int> minimumLength{this, "MinimumPinyinLength",
                                     _("Minimum Pinyin Length"), 4};
    fcitx::Option<CloudPinyinBackend> backend{this, "Backend", _("Backend"),
                                              CloudPinyinBackend::GoogleCN};);
```

果不其然，在cloudpinyin.cpp里头看到了下面这段，现在配置存放的位置也知道了。

```cpp
void CloudPinyin::reloadConfig() {
    readAsIni(config_, "conf/cloudpinyin.conf");
}
```

接下来改成百度试试看，创建`~/.config/fcitx5/conf/cloudpinyin.conf`并写入下面内容

```
Backend=Baidu
```

然后就是见证奇迹的时刻，打开Wireshark，然后在文本框随意输入一串拼音首字母，就可以看到云拼音后端确实是切换成百度了。这里篇幅所限，仅展示部分Wireshark输出。

```
7	4.990732355	Standard query 0xbc7e A olime.baidu.com
8	4.990791024	Standard query 0xba76 AAAA olime.baidu.com
9	5.000496417	Standard query response 0xbc7e A olime.baidu.com
10	5.218008595	Standard query response 0xba76 AAAA olime.baidu.com
```

然后我顺便看了眼API，看起来靠谱，应该不会被直播打字吧。个人感觉谷歌的API效果更好，百度的API很多时候出不来结果。

```
# Google
https://www.google.com/inputtools/request?ime=pinyin&text=lianganyuanshengtibuzhu
["SUCCESS",[["lianganyuanshengtibuzhu",["两岸猿声啼不住"],[],{"annotation":["liang an yuan sheng ti bu zhu"],"candidate_type":[0],"lc":["16 16 16 16 16 16 16"]}]]]

# Baidu
https://olime.baidu.com/py?rn=0&pn=1&ol=1&py=qingzhouyiguowanchongshan
{"0":[[["轻舟已过万重山",25,{"pinyin":"qing'zhou'yi'guo'wan'chong'shan","type":"IMEDICT"}]]],"1":"qing'zhou'yi'guo'wan'chong'shan","result":[null]}
```

所以如果要查看其它可配置项目，直接看对应模块的头文件定义和代码实现就行了。

## 修改主题

看了一圈，一堆教程都推荐[Fcitx5-Material-Color](https://github.com/hosxy/Fcitx5-Material-Color)，看图例感觉还不错，于是依葫芦画瓢装个试试。安装方法在repo的Readme已经写的很清楚了，我就不赘述了。

更多主题可以看看[拥抱 Fcitx5 | 倚窗，听雨](https://blog.lhwcrt.top/tech/welcome-to-fcitx5/)，或者在aur直接搜。

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
* SMPlayer：个人感觉比VLC好用

```
yay -S --noconfirm google-chrome
sudo pacman -S --noconfirm filezilla
yay -S --noconfirm wps-office wps-office-mui-zh-cn wps-office-fonts ttf-wps-fonts
sudo pacman -S --noconfirm telegram-desktop
sudo pacman -S --noconfirm discord
linux_kernel_ver=$(mhwd-kernel -li | grep -oP 'linux\d+' | head -n 1)
sudo pacman -S --noconfirm virtualbox $linux_kernel_ver-virtualbox-host-modules
sudo gpasswd -a $USER vboxusers
sudo pacman -S --noconfirm smplayer
```

## 汉化包

这些汉化包其实装不装都行的，感觉平时也很少用这几个软件。

```
sudo pacman -S --noconfirm firefox-i18n-zh-cn
sudo pacman -S --noconfirm thunderbird-i18n-zh-cn
sudo pacman -S --noconfirm gimp-help-zh_cn
```

## 疑难杂症

### Chrome在每次开机后首次启动要求keyring密码

这个问题貌似只有xfce下才会出现，一个简单的处理方法就是设置为空密码，不过安全性可能会下降。鱼和熊掌不可兼得，这个自行取舍。

使用如下命令备份keyrings后删除，如果只存放了Chrome的keyring就不需要备份，直接删除就行

```
cp -r ~/.local/share/keyrings ~/keyrings-backup
rm ~/.local/share/keyrings/*
```

然后重启系统，再次打开Chrome，就会重新要求设定keyring密码。这里直接敲回车（空密码），会提示“By choosing to use a blank password, your stored passwords will not be safely encrypted. They will be accessible by anyone with access to your files.”，这里直接点continue即可。

参考文章：[Chrome harasses me for a keychain password at startup](https://unix.stackexchange.com/questions/324843/chrome-harasses-me-for-a-keychain-password-at-startup)

### 浏览器默认缩放值

使用高分屏的话，浏览器的字会很小。平时Win10有全局150%的缩放，但是Manjaro就需要自己动手设置。

个人感觉缩放设置在125%会比较舒服。

Chrome：Settings > Page zoom

Firefox：Preferences > Zoom > Default zoom

### Chrome用触摸板滑动没有惯性

这个功能叫smooth scrolling（用inertial或kinetic也能搜到这类问题），Chrome好像不支持libinput，所以目前无解。

Bug tracker：[763791 - Please support libinput kinetic scrolling. - chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=763791)

### Discord强制要求更新

虽然discord在linux下表现很棒，但是强制更新这个确实有点恶心。有时候Manjaro的仓库里头还没有更新discord版本，但是discord客户端不更新就不让用了。好在客户端本身并不是真的不让登录，只是简单的检测了下版本号，所以应该知道怎么解决了吧。

首先找到discord的路径，如下所示

```
$ ls -al `which discord`
lrwxrwxrwx 1 root root 20 Apr 21 09:58 /usr/bin/discord -> /opt/discord/Discord
```

然后在discord文件夹找到`./resources/build_info.json`，修改里头的版本号即可。

参考文章：[Discord won't open on Linux when an update is available](https://support.discord.com/hc/en-us/community/posts/360057789311-Discord-won-t-open-on-Linux-when-an-update-is-available)

### VLC看NAS上的视频经常断流

这个问题很神奇，不管是Windows还是Linux，只要用VLC播放就会间歇性断流，在 Preference > Input / Codecs > Advanced 修改File caching和Network caching也不管用。

所以我直接换成了SMPlayer，然后就再也没出现过断流的问题。

# QQ & Wechat

QQ和微信这两个一直都不太好搞，值得单独拿出来说说。目前看来基本有三套可行方案。

## Virtualbox

最容易的就是直接在Virtualbox里头跑完整的系统，然后使用seamless mode（Right Ctrl + L），不过视觉效果看起来不太好，QQ周围会有一圈Windows的背景。

当然，在虚拟机下运行的效果肯定是最好的，也不会出什么奇怪的毛病，就是占用资源会比较多。QQ截图功能只能在虚拟机内使用，并且使用的也是虚拟机内的输入法。

## LinuxQQ

官方也有发布Linux版QQ，不过UI十分简陋，功能也不全，简直是梦回十年前。最麻烦的问题，还是不能用帐号密码登录，必须要用手机扫码，不知道用意何在。

目前最新版是2020/4/9发布的`2.0.0 Beta2`，仅仅打字聊天的话还是可以胜任的。想要体验的话可以直接安装大佬打包好的AUR包，或者在官网下载pacman包。

## deepin-wine

这里重点说下`deepin-wine`方案。虽然各种小毛病挺多的，不过总体表现不错。AUR上面有大佬打包好的，基本上是开箱即用。而且更香的是，`deepin-wine`方案的QQ截图是可以作用于全局的，只要QQ拥有焦点，就可以使用截图热键（Ctrl + Alt + A）。

这里以TIM QQ为例，使用下面命令安装

```
yay -S --noconfirm deepin-wine-tim
```

安装之后，在`/opt/deepinwine/apps/Deepin-TIM/run.sh`文件头部的`WINE_CMD="wine"`下面添加如下代码，确保输入法可以在QQ中使用。

```
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS="@im=fcitx5"
```

由于原版`wine`的QQ托盘图表有点问题，而且不能保存密码，因此维护大佬建议切换到`deepin-wine`。

好在大佬已经准备好了一键脚本，直接运行下面命令就能安装需要的依赖，移除已安装的TIM目录并回退对注册表文件的修改。

```
/opt/deepinwine/apps/Deepin-TIM/run.sh -d
```

注意：切换到`deepin-wine`后，对`wine`的修改，如更改dpi，都改为对`deepin-wine`的修改。

想更进一步了解可以看[deepin-wine-tim-arch](https://github.com/countstarlight/deepin-wine-tim-arch)这个repo。

## deepin-wine疑难杂症

### 字体太小

先退出QQ/微信，然后在终端运行下面代码

```
# 原版wine运行这个
env WINEPREFIX="$HOME/.deepinwine/Deepin-TIM" winecfg

# deepin-wine运行这个
env WINEPREFIX="$HOME/.deepinwine/Deepin-TIM" deepin-wine winecfg
```

在弹出来的wine设置面板中找到显示 > 屏幕分辨率，修改dpi即可。

### 个人文件夹被占用

这个是因为QQ进程有残留，在启动之前杀掉就可以了。

```bash
kill $(ps aux | grep '[T]IM.exe' | awk '{print $2}')
```

这里我是直接修改了桌面的launcher，使用文本编辑器打开launcher，将Exec那行替换成下面这个即可

```
Exec=sh -c "kill $(ps aux | grep '[T]IM.exe' | awk '{print $2}'); '/opt/deepinwine/apps/Deepin-TIM/run.sh' -u %u"
```

之前倒是还见过一个Python版本的，也顺便贴在这里，虽然我是感觉有点杀鸡用牛刀了。出处是[解决Linux下的Wine TIM多次登录文件夹被占用的问题](https://zhuanlan.zhihu.com/p/31312938)

```python
import psutil
import os
import signal

# 获取进程列表
process_list = [psutil.Process(pid) for pid in psutil.pids()]

# 遍历并找到TIM.exe对应的pid
for process in process_list:
    # 如果找到残留的TIM进程就kill掉
    if process.name() == 'TIM.exe':
        print(process)
        os.kill(process.pid, signal.SIGKILL)
```

### 表情/@人/右键无效

QQ自带的表情（不是emoji）发不出去，然后右键菜单（例如回复指定消息，撤回）无法使用，群里也没法在输入框中@其他人。

解决不能发表情/@其他人：设置（Settings） > 窗口管理器（Window Manager） > 焦点（Focus） > 取消勾选自动聚焦新创建的窗口（Automatically give focus to newly created windows）。

解决不能右键使用：设置（Settings） > 窗口管理器微调（Window Manager Tweaks） > 焦点（Focus） > 取消勾选遵照标准的ICCCM焦点提示（Honor standard ICCCM focus hint）。

然后就会发现新建终端之后没法直接输入，需要点击窗口获取焦点才行。根据issue下方的讨论跟帖，只要重新勾选自动聚焦新创建的窗口就行了，而且QQ表情不会受影响。我试了下，果然如此，也不知道是什么原理，反正问题解决了就行。

参考文章：[关于xfce环境下qq不能发表情和右键使用的解决办法 #87](https://github.com/askme765cs/Wine-QQ-TIM/issues/87)

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

其中VSCode还是需要更进一步的配置。

VSCode的配置文件在~/.config/Code - OSS/User/settings.json，这里给出我的配置

```
{
    "files.autoSave": "afterDelay",
    "editor.fontSize": 18,
    "editor.wordWrap": "on",
    "window.zoomLevel": 0.5
}
```

当然插件是必不可少的，这里直接通过命令行安装，省事儿。

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

如果需要编译运行C# (.Net)程序，那建议直接安装全家桶：
* mono
* monodevelop-bin
* mono-msbuild
* mono-msbuild-sdkresolver

```
sudo pacman -S --noconfirm mono
yay -S --noconfirm monodevelop-bin
yay -S --noconfirm mono-msbuild
yay -S --noconfirm mono-msbuild-sdkresolver
```

# 打印机

Manjaro自带[CUPS](https://wiki.archlinux.org/index.php/CUPS_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))（Common Unix Printing System），可以直接通过Web UI来进行管理，不过这里用命令行就更快更方便。

下面以我的打印机Brother HL-L2320D为例，各位自行替换成自己的型号。

首先需要准备ppd文件（打印机描述文件）。Manjaro自带了很多来自Foomatic和Gutenprint的ppd文件，所以执行下面命令先看看有没有。

```
lpinfo -m | grep "HL-L2320D"
```

如果有那就万事大吉，没有也没关系，这时候去AUR看看有没有别人构建好的ppd文件。我运气还不错，已经有现成的可以下载。如果AUR也没有，那么就要自行提取ppd文件了，兄弟打印机的提取方法可以看[Packaging Brother printer drivers - Arch Wiki](https://wiki.archlinux.org/index.php/Packaging_Brother_printer_drivers)。

```
yay -S --noconfirm brother-hll2320d
```

搞定ppd文件之后，再执行刚才的`lpinfo`命令就能看到ppd文件的路径了。

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

上面这个是双面打印的相关设置，默认是关闭的，这里要用下面命令打开

```
lpadmin -p HL-L2320D -o Duplex=DuplexNoTumble
```

这个地方有个大坑，正确方法当然是用`lpadmin`，错误方法是使用`lpoptions`。因为是要在GUI环境下打印，所以只有通过`lpadmin`修改，其它程序才能看到。`lpoptions`也可以跟同样的参数修改，不过只能被`lp`和`lpr`这类基于命令行的打印程序看到。

大坑参考的是[Setting CUPS defaults with lpoptions vs web interface
](https://unix.stackexchange.com/questions/339205/setting-cups-defaults-with-lpoptions-vs-web-interface)

CUPS的命令行管理文档可以看[Command-Line Printer Administration](https://www.cups.org/doc/admin.html)

# 触摸板

跟Windows一模一样的应该只有“双指点击”（等同于右键单击）

## 双指滑动和轻按

Manjaro双指滑动的方向跟Windows是相反的，而且触摸板轻按无效。好在这些配置可以随意改。

在 Settings > Mouse and Touchpad 可以找到键鼠相关设置，然后在Device下拉菜单那里选中自己的触摸板。在Buttons and Feedback栏目勾选Reverse scroll direction，然后在Touchpad栏目勾选Tap touchpad to click，就搞定了。

## 更多手势

如果需要更多手势，需要执行下面命令安装相关软件

```
sudo pacman -S --noconfirm libinput-gestures
sudo pacman -S --noconfirm gestures
sudo pacman -S --noconfirm xdotool
```

接下来依次执行下面命令

```bash
# 把自己（当前用户）加入input组
sudo gpasswd -a $USER input
# 添加开机启动
libinput-gestures-setup autostart
# 启动libinput-gestures
libinput-gestures-setup start
```

然后就打开gestures添加手势就行了。如果要抄别人的配置，那就在~/.config/中找到libinput-gestures.conf，然后在文件末尾写入下面配置。

```bash
# 浏览器前进
gesture swipe left 3	xdotool key alt+Right
# 浏览器后退
gesture swipe right 3	xdotool key alt+Left
# 显示桌面
gesture swipe down 3	sh -c 'win_name=$(xdotool getwindowfocus getwindowname); if [[ $win_name != 'Desktop' ]] && [[ $win_name != *'conky'* ]]; then xdotool key ctrl+alt+d; fi'
# 查看所有打开的窗口
gesture swipe up 3	sh -c 'win_name=$(xdotool getwindowfocus getwindowname); if [[ $win_name == 'Desktop' ]] || [[ $win_name == *'conky'* ]]; then xdotool key ctrl+alt+d; fi'
```

# 设置时钟

## 个性化时间日期显示

打开Clock的设置，居然不能直接从GUI设置24小时制，这怎么能忍？好在可以自定义格式，左下角有个[Help](https://docs.xfce.org/xfce/xfce4-panel/4.14/clock)，可以看到时间日期格式清单。

这里我使用的是`%F %R`，等价于`%Y-%m-%d %H:%M`。

## 修正时区问题

这个问题我记得是Linux和Windows看待电脑硬件时间的方式不太一样。如果时区正确设置但是时间仍然不对，运行下面命令就好了

```
sudo timedatectl set-ntp 1
```

# 托盘显示电量

右下角只有电池图标，点进去才能看到剩余电量，就感觉这个图标特别鸡肋，希望能够在外面就显示剩余电量百分比。

进入Settings > Panel > Items，添加Power Manager Plugin或者Battery Monitor，这个就看自己喜好了。

Power Manager Plugin属于xfce4-power-manager，设置项特别少，只有百分比和剩余时间两个选项，而且还有个傻大粗的鸡肋电池图标。不过点击电池图标会有更多功能，比如显示外设电量，调节亮度，进入Power Manager设置面板。

Battery Monitor属于xfce4-battery-plugin，设置项丰富，可以在托盘展示各种类型的信息，不过也就只能展示，想要修改配置还是得靠xfce4-power-manager。

# 双显示器（HDMI）

## 用GUI设置

正常情况下，GUI点几下还是非常方便的，没有特殊需求的话，建议用GUI操作。

### 设置显示输出

显示设置项在Settings > Display，系统默认是mirror displays，取消勾选，然后点Apply，就搞定了。

### 设置声音输出

声音输出跟Windows不一样，是要分开设置的。点右下角托盘的喇叭 > Audio mixer，或者终端直接输入`pavucontrol`（GTK）/ `pavucontrol-qt`（Qt）。

在弹出的窗口，找到Configuration，会看到Built-in Audio Profile的下拉菜单，选择Digital Stereo (HDMI) Output即可。如果要切换回来就选Analog Stereo Output。如果没找到想要的输出设备，可以用`aplay -l`查看所有声卡和音频设备（List all soundcards and digital audio devices）。

## 用命令行设置

当然，如果不想每次外接显示器都这么点几下，或者想写进自动化脚本，可以直接用万能的命令行。

### 设置显示输出

这里用`xrandr`进行设置。

首先，使用`-q`或者`--query`查看当前能用的显示器，这里节选部分输出展示。

```
$ xrandr -q
Screen 0: minimum 8 x 8, current 3840 x 1080, maximum 32767 x 32767
eDP1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 340mm x 190mm
   1920x1080     60.03*+  59.93    
HDMI1 connected 1920x1080+1920+0 (normal left inverted right x axis y axis) 890mm x 500mm
   1920x1080     60.00*+  59.94    30.00    24.00    29.97    23.98  
```

可以看到笔记本自带的`eDP1`和外接的`HDMI1`，这里可以用下面命令，把`HDMI1`拼接到`eDP1`的右边。

```bash
# --auto 以系统偏好的分辨率（最大分辨率）
# 如无特殊需求，直接 --auto 即可
xrandr --output HDMI1 --auto --right-of eDP1

# --mode 可以制定可用的分辨率（xrandr -q 可以查看）
xrandr --output HDMI1 --mode 1280x720 --right-of eDP1
```

参考文章：[Xrandr (简体中文) - ArchWiki](https://wiki.archlinux.org/index.php/Xrandr_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

### 设置声音输出

这里用`pactl`（选项少）和`pacmd`（选项多，有交互式环境）进行设置，因为自带的`pavucontrol`只提供GUI设置，对应的命令行也是用来打开GUI的。

首先使用`pacmd`的`list-cards`查看声卡信息（或者直接输入`pacmd`进入交互式环境）。这里由于输出了近百行的内容，因此删去大量无关紧要的信息。

```
$ pacmd list-cards
1 card(s) available.
	name: <alsa_card.pci-0000_00_1f.3>
	profiles:
		input:analog-stereo: Analog Stereo Input (priority 65, available: unknown)
		output:analog-stereo: Analog Stereo Output (priority 6500, available: unknown)
		output:analog-stereo+input:analog-stereo: Analog Stereo Duplex (priority 6565, available: unknown)
		output:hdmi-stereo: Digital Stereo (HDMI) Output (priority 5900, available: unknown)
		output:hdmi-stereo+input:analog-stereo: Digital Stereo (HDMI) Output + Analog Stereo Input (priority 5965, available: unknown)
		off: Off (priority 0, available: unknown)
	active profile: <output:hdmi-stereo+input:analog-stereo>
```

这里`name`就是声卡名字，`profiles`是输入输出的方案。

然后可以用`pactl`或者`pacmd`来设置，一般来说只会在下面两个方案之间切，注意命令里头的`声卡名字`需要自行替换。

```bash
# 命令格式（pacmd）：pacmd set-card-profile <NAME> <PROFILE>
# 命令格式（pactl）：pactl set-card-profile <NAME> <PROFILE>

# 没有外接显示器 / 外接不带音响的显示器
# Analog Stereo Duplex -> output:analog-stereo+input:analog-stereo
pacmd set-card-profile alsa_card.pci-0000_00_1f.3 output:analog-stereo+input:analog-stereo

# 外接带音响的显示器（例如电视）
# Digital Stereo (HDMI) Output + Analog Stereo Input -> output:hdmi-stereo+input:analog-stereo
pacmd set-card-profile alsa_card.pci-0000_00_1f.3 output:hdmi-stereo+input:analog-stereo
```

参考资料：[PulseAudio/Examples - ArchWiki](https://wiki.archlinux.org/index.php/PulseAudio/Examples)

# 亮度精准调节

自带的xfce4-power-manager虽然可以接管笔记本上的亮度按键，但是每按一次的变化量是10，实在是太大了。更过分的是，Power Manager居然还不让配置step参数，导致如果想继续使用Power Manager，就只能自行修改源码重新编译。

编译是不可能编译的，搞不好又出什么诡异的问题！

所以首先就要关闭Power Manager对亮度按键的接管（Handle display brightness keys），然后使用命令行工具`xorg-xbacklight`来调节亮度。亮度的范围是0-100，直接输入`xbacklight`就可以看到当前亮度。需要调节亮度，可以在`xbacklight`后面带上变化量。

当然不可能每次都敲命令调节亮度，所以要在 Settings > Keyboard > Application Shortcuts 设置快捷键。

| Command       | Shortcut                |
|---------------|-------------------------|
| xbacklight +2 | Monitor brightness up   |
| xbacklight -2 | Monitor brightness down |

不过这么搞，就不能在调节之后马上看到亮度条了，因为亮度条是xfce4-power-manager的一部分。反正我觉得不亏，毕竟现在可以通过快捷键把亮度降得很低了。

# 自定义grub

自带的grub有点丑，而且分辨率还比较低，可以在`/etc/default/grub`修改，或者直接用带有GUI界面的`grub-customizer`，可以通过pacman或者yay安装。

其实还能直接安装配置好的主题，可以在[Grub Themes](https://www.gnome-look.org/browse/cat/109/ord/rating/)下载。

# 新建文件Template

在Windows系统上，右键点击空白处就可以新建各类文件，相比之下Manjaro默认只能新建Empty File，所以可以添加一些常用的template。

正常情况下template文件都存在`～/Templates`，可以通过`cat ~/.config/user-dirs.dirs`确认。如果不是，那可以用下面命令修改。

```
xdg-user-dirs-update --set TEMPLATES ~/Templates
```

只需要把一个空的对应格式的文件（注意不是新建Empty File然后改后缀名）放进`～/Templates`，template的文件名将会是右键菜单显示的名字，最后log out再log in就能生效了。

xfce Thunar官方的文档可以看[Working with Files and Folders](https://docs.xfce.org/xfce/thunar/working-with-files-and-folders)

参考文章：[Thunar Create Document > / General discussion / Xfce Forums](https://forum.xfce.org/viewtopic.php?id=11873)

# 桌面挂件（conky）

conky是一个能在桌面展示信息的开源项目，类似Android上的widget。

除了下面我试过的这些用法，还可以看看[Conky/Tips and tricks - ArchWiki](https://wiki.archlinux.org/index.php/Conky/Tips_and_tricks)。

## 安装

用下面命令安装，conky-manager是带GUI的配置工具，装不装都行，好像也用不上。

```
sudo pacman -S --noconfirm conky conky-manager
```

然后顺手在Settings > Session and Startup > Application Autostart设置下开机启动。这里使用`sleep 5`是要确保conky在网络连接后启动，否则有些需要网络的命令（例如gcalcli）可能获取不到信息。

```
Name: conky
Description: light-weight system monitor
Command: sh -c "sleep 5 && nohup conky > /dev/null 2>&1 &"
Trigger: on login
```

或者也可以把下面内容写到`～/.conky`下面的`conky-startup.sh`，然后开机启动那里的`Command`修改为用`sh`执行这个脚本。

```
sleep 5
nohup conky > /dev/null 2>&1 &
exit 0
```

## 配置

`conky --print-config`可以输出默认配置，所以使用下面命令生成配置文件

```
mkdir -p ~/.config/conky && conky --print-config > ~/.config/conky/conky.conf
```

所有的配置项可以看[Configuration Settings](http://conky.sourceforge.net/config_settings.html)，文档本身清晰明了，我就提几个重点配置项。

### 保持在桌面上

先说最重要的，在默认配置下，如果点击桌面空白处，conky窗口就没了。。。

网上答案五花八门，实际上把`own_window_hints`改成`'below'`就解决了。

参考内容：[Conky disappears when I click on the desktop #205](https://github.com/brndnmtthws/conky/issues/205)

### 窗口位置

`alignment`、`gap_x`、`gap_y`一起决定了conky在桌面上的位置。

### 字体

用不用等宽字体（Mono）看需求，等宽字体没那么好看，但是可以对齐。如果要指定style，可以在字体名后面加上`:style=xxx`。下面给出我的配置。

```
conky.config = {
    font = 'WenQuanYi Micro Hei Mono:size=12'
}
```

### 透明背景

```
conky.config = {
    own_window_transparent = true,
    own_window_argb_visual = true,
}
```

### 显示内容

依葫芦画瓢去修改配置文件的`conky.text`部分即可。conky的wiki也收集了一些[很漂亮的配置方案](https://github.com/brndnmtthws/conky/wiki/Configs)。

内置变量可以看[Conky Objects](http://conky.sourceforge.net/variables.html)

## 显示gcalcli

`gcalcli`是Google Calendar的开源第三方命令行工具，使用下面命令安装

```
yay -S --noconfirm gcalcli
```

`gcalcli`需要`client_id`和`client_secret`才能工作，本来`gcalcli`可以自动引导获取的，但是这个操作貌似被Google禁止了，所以需要手动获取。在[Google Calendar API Quickstart](https://developers.google.com/calendar/quickstart/python)点击“Enable the Google Calendar API”来快速获取。拿到之后运行下面命令就可以绑定了。

```
gcalcli --client_id=YOUR_ID --client_secret=YOUR_SECRET agenda
```

最后把下面这行放进conky配置文件的`conky.text`就大功告成了。

```
${execpi 300 gcalcli --conky agenda}
```

参考内容：[Sign in with Google temporarily disabled for this app #497](https://github.com/insanum/gcalcli/issues/497)

### 修改颜色

很奇怪，以前文档应该是有写这些，但是现在没找到。

```
--[no]color: Enable/Disable all color output
    (default: 'true')
--color-border: Color of line borders
    (default: 'white')
--color-date: Color for the date
    (default: 'yellow')
--color-freebusy: Color for free/busy calendars
    (default: 'default')
--color-now-marker: Color for the now marker
    (default: 'brightred')
--color-owner: Color for owned calendars
    (default: 'cyan')
--color-reader: Color for read-only calendars
    (default: 'magenta')
--color-writer: Color for writable calendars
    (default: 'green')
```

例如下面就是把日期从默认的黄色改成绿色

```
gcalcli --conky agenda --color-date green
```

参考文章：[[SOLVED] Some help with Conky (related to gcalcli)](https://forums.bunsenlabs.org/viewtopic.php?id=1717)

## 显示天气

### OpenWeatherMap

网站上给出了很清晰的[注册教程](https://openweathermap.org/guide)，跟着走就能拿到API key了。

建议使用[One Call API](https://openweathermap.org/api/one-call-api)，一次请求就能获取这些信息：
* 当前天气
* 1小时内的每分钟预测
* 48小时内的每小时预测
* 7天内的每天预测
* 过去5天的天气信息

要注意的是，白嫖帐号每天只能调用1000次One Call API，只要刷新频率不是太高的话，应该是完全够用的。

这里给出自用代码，需要自行提供经纬度和API key。

```py
import json
import requests
from datetime import datetime

def to_utc_format(unix_timestamp):
    return datetime.utcfromtimestamp(unix_timestamp).strftime('%Y-%m-%d %H:%M:%S')

def to_24h_format(unix_timestamp):
    return datetime.utcfromtimestamp(unix_timestamp).strftime('%H:%M')

def to_mmdd_format(unix_timestamp):
    return datetime.utcfromtimestamp(unix_timestamp).strftime('%m/%d')

# 配置项
# 经度（东西地理位置）
longitude = <YOUR_LONGITUDE>
# 纬度（南北地理位置）
latitude = <YOUR_LATITUDE>
# 计量单位（°C -> metric，°F -> imperial，K -> 留空）
units = "metric"
# API key
appid = <YOUR_API_KEY>
# 展示未来X小时的天气
hourly_forecast_cnt = 3
# 展示未来X天的天气
daily_forecast_cnt = 3
# 当前天气颜色
curr_color = "red"
# 未来X小时的天气颜色
hourly_color = "red"
# 未来X天的天气颜色
daily_color = "red"

url = f"http://api.openweathermap.org/data/2.5/onecall?lat={latitude}&lon={longitude}&units={units}&appid={appid}"
res = requests.get(url)
weather_info = res.json()

'''
# 本段代码用于测试API
with open("weather.json") as f:
    weather_info = json.load(f)
'''

# 输出结果顶部空一行（个人喜好）
output = "\n"

# 当前天气
# ["weather"]是list，可能会同时存在多种天气，这里只取第一个天气，如果要读取全部可以自行套个for循环。
timezone_offset = int(weather_info["timezone_offset"])
curr_time = to_24h_format(int(weather_info["current"]["dt"]) + timezone_offset)
curr_temp = round(weather_info["current"]["temp"])
curr_weather = weather_info["current"]["weather"][0]["main"]
curr_description = weather_info["current"]["weather"][0]["description"]
output += f"${{color {curr_color}}}"
output += f"【{curr_time}】{curr_temp}°C, {curr_weather} ({curr_description})\n"
output += "${color}"

# 获取未来X小时的预测
for idx in range(1, hourly_forecast_cnt + 1):
    ftr_time = to_24h_format(int(weather_info["hourly"][idx]["dt"]) + timezone_offset)
    ftr_temp = round(weather_info["hourly"][idx]["temp"])
    ftr_weather = weather_info["hourly"][idx]["weather"][0]["main"]
    ftr_rain_perc = weather_info["hourly"][idx]["pop"]
    output += f"${{color {hourly_color}}}"
    output += f"【{ftr_time}】{ftr_temp}°C, {ftr_weather}, {round(ftr_rain_perc * 100)}% Rain\n"
    output += "${color}"

# 未来X天预测
for idx in range(1, daily_forecast_cnt + 1):
    ftr_time = to_mmdd_format(int(weather_info["daily"][idx]["dt"]) + timezone_offset)
    ftr_temp_min = round(weather_info["daily"][idx]["temp"]["min"])
    ftr_temp_max = round(weather_info["daily"][idx]["temp"]["max"])
    ftr_weather = weather_info["daily"][idx]["weather"][0]["main"]
    ftr_rain_perc = weather_info["daily"][idx]["pop"]
    output += f"${{color {daily_color}}}"
    output += f"【{ftr_time}】{ftr_temp_min}-{ftr_temp_max}°C, {ftr_weather}, {round(ftr_rain_perc * 100)}% Rain\n"
    output += "${color}"

print(output)
```

最后在`conky.conf`里头添加下面这行就可以了，路径自行替换。

```
${execpi 300 python <PATH_TO_weather.py>}
```

### wttr.in

如果只需要当前天气，那就直接从`wttr.in`抓就可以了，网上随便找了个，试了能用。如果要在conky里头展示颜色，那需要把终端颜色代码动态替换成conky的颜色代码。

```
curl -s wttr.in | sed -n '3,7{s/\d27\[[0-9;]*m//g;s/^..//;s/ *$//;p}'
```

参考文章：[How to add wttr.in to .conkyrc so that conky can show the weather #118](https://github.com/chubin/wttr.in/issues/118)

### AccuWeather (RSS)

AccuWeather的API要氪金，但是其实他们还有个RSS可以白嫖（仅限个人使用）。

```
http://rss.accuweather.com/rss/liveweather_rss.asp?metric=xxx&locCode=xxx
metric: 0 -> °F, 1 -> °C
locCode: 美国用户可以直接写邮编，其它地方就要用国家缩写+城市，例如“DE|FRANKFURT”
例子：http://rss.accuweather.com/rss/liveweather_rss.asp?metric=1&locCode=NL|AMSTERDAM
```

返回内容是XML，筛选下信息就能拿到天气了。

参考内容：[Conky - Really Simple Weather Script](https://bbs.archlinux.org/viewtopic.php?id=37381)

# 小结

目前要调教的地方基本上就这么多，后续有发现新的内容会继续更新。

感谢Telegram Manjaro Linux CN群的@AsamiSaori（浅见 沙织）协助改进sudo和fcitx5部分内容～