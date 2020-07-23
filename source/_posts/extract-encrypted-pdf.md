---
title: 记一次China-DRM加密的PDF破解
categories:
  - 技术
date: 2020-07-22 15:16:40
permalink: 
---
# 前情提要

最近备考GRE，在GitHub上面找到了一些备考资料，其中有个文件叫`数学120题.exe`。我开始以为是某种模考软件，clone仓库之后才发现居然是加密的PDF文档。好家伙，以前只见过PDF自带的密码，还真没见过这种“一机一码”形式的。这么个绝佳的研究（摸鱼）机会，当然不能放过啦~

<!--more-->

既然要分析这种来路不明的可执行文件，当然要在虚拟机里头折腾啦。我这次犯的错误，就是直接在Host OS上面运行了，后面当然也吃到了一点苦头。

# 明察秋毫

第一步当然就是双击程序看看，结果却吃了闭门羹。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_1.png)

既然如此，那我下载个Adobe Reader 9应该就能打开了吧。不出所料，这回终于见到了交互界面。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_2.png)

我当然是没有阅读密码的，那就随便输入点内容看看会有啥反应吧。看起来只能输入一串16进制的数字，而且如果输入内容过长就会直接闪退。不过这个中文的报错信息“阅读授权不正确”貌似可以作为突破口。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_3.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_4.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_5.png)

# 初露锋芒

用peid看了下，这个加密文件貌似没有壳，那就直接上逆向工具了。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_6.png)

用IDA打开加密文件，发现加密文件中绝大部分都是数据，看上去货真价实。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_7.png)

试图使用`Local Windows debugger`进行调试，然而报错，报错内容如下：

```
766C43D2: unknown exception code EF000007 (exc.code ef000007, tid 13496)
UNKNOWN 766C43D2: KernelBase.dll:kernelbase_RaiseException+62
```

条条大路通罗马，既然没法调试，那就按F5看看伪代码吧，然而又失败，报错如下：

```
Decompilation failure:
4D87A0: call analysis failed

Please refer to the manual to find appropriate actions
```

我去网上搜了一圈，好像要做什么“堆栈平衡”，于是乎我依葫芦画瓢，开启显示`Stack Pointer`，然后`Alt+K`手动调整，然而还是失败。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_8.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_9.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_10.png)

到这里我已经跟这加密文件杠上了，有种不撞南墙不回头的感觉，既然IDA不好使，就换个工具。于是我掏出了古老的OllyDbg，成功附加到加密文件上了。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_11.png)

用`Ctrl+G`跳转到程序入口，然后`F9`让程序加载完成之后，`右键` > `中文搜索引擎` > `智能搜索`就可以看到文本字符串了~

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_12.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_13.png)

比较奇怪的是，之前用工具看的结果是`Microsoft Visual C++ 6.0`，但是这里居然能看到`Borland Delphi`的字符串，感觉有点问题。

| 地址     | 反汇编                | 文本字符串                      |
|----------|-----------------------|---------------------------------|
| 00405DDC | push crackme.00405FDC | Software\Borland\Locales        |
| 00405DFA | push crackme.00405FDC | Software\Borland\Locales        |
| 00405E18 | push crackme.00405FF8 | Software\Borland\Delphi\Locales |
| 004319CD | push crackme.004319F8 | Delphi Picture                  |
| 004319DD | push crackme.00431A08 | Delphi Component                |

再往下翻翻，发现程序居然往硬盘上写东西，路径是`c:\china-drm\`。看了眼，文件夹里头只有一个名为`pdfreadersts.ini`的空文件。不过也歪打正着知道了这个加密的名称。大概在网上搜了下关键词，发现虽然有零星几篇半桶水教程，但是他们都是在有一对确定可用的机器码和密钥的情况下破解的，破解方法就是替换机器码。这显然不适用于我，那就只能继续摸索了呗。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_14.png)

继续翻看，又发现了一些耐人寻味的东西，看起来在试图阻止截图和打印。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_15.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_16.png)

然后我还发现了这两条指令，果不其然，这个加密文件直接关闭了我的`Print Spooler`服务，这时候试图打印会提示`No Printer Installed`，然而实际上当然有安装打印机。所以吃一堑长一智，以后这种东西一定要放虚拟机里头捣鼓。这回运气好，只是被关了服务，要是触发暗桩被格盘可就惨了。

| 地址     | 反汇编                | 文本字符串                   |
|----------|-----------------------|------------------------------|
| 0049AF17 | push crackme.0049B16C | cmd.exe /c net stop Spooler  |
| 0049C71E | push crackme.0049C7D4 | cmd.exe /c net start Spooler |

# 困难重重

刚刚在上面看到`阅读密码不正确`这个关键的字符串，那就定位过去看看实际的汇编代码。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_17.png)

我开始以为`test`也是数值比较，后来查阅资料发现，`test`是用来测试一个位（performs a bitwise AND on two operands），这里应该是用来测试一方寄存器是否为空，具体可以看[The point of test %eax %eax](https://stackoverflow.com/questions/13064809/the-point-of-test-eax-eax)。`je`是如果真就跳转（Jump if condition is met）。因为这里要跳过`阅读密码不正确`，所以直接把`je`改成`jmp`，即无条件跳转（performs an unconditional jump）。改完之后如下所示。

```asm
00496E00    84DB            test bl,bl
00496E02    EB 0F           jmp short crackme.00496E13
00496E04    B8 9C714900     mov eax,crackme.0049719C                 ; 阅读密码不正确
00496E09    E8 F267F9FF     call crackme.0042D600
00496E0E    E9 91020000     jmp crackme.004970A4
00496E13    8B86 08030000   mov eax,dword ptr ds:[esi+0x308]
00496E19    8B10            mov edx,dword ptr ds:[eax]
```

一共有三处`阅读密码不正确`，全都如法炮制就可以了。然后随意输入阅读密码，这回就不出现`阅读密码不正确`，但是又出现了另一个错误提示。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_18.png)

下断点定位，看起来这个地方应该是无法从上往下正常到达的，必然是通过`jmp`。

```asm
00496BC0    E8 53DFF6FF     call crackme.00404B18
00496BC5    74 1E           je short crackme.00496BE5
00496BC7    B8 44714900     mov eax,crackme.00497144                 ; 阅读授权不合法！
00496BCC    E8 2F6AF9FF     call crackme.0042D600
00496BD1    E9 CE040000     jmp crackme.004970A4
00496BD6    B8 60714900     mov eax,crackme.00497160                 ; 阅读授权不正确！
00496BDB    E8 206AF9FF     call crackme.0042D600
00496BE0    E9 BF040000     jmp crackme.004970A4
00496BE5    8BC3            mov eax,ebx
00496BE7    E8 B0CDF6FF     call crackme.0040399C
```

所以通过堆栈得知跳转之前的地址，然后把`jnz`变成`nop`就好了

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_19.png)

```asm
00496AC3    83F8 04         cmp eax,0x4
00496AC6    90              nop
00496AC7    90              nop
00496AC8    90              nop
00496AC9    90              nop
00496ACA    90              nop
00496ACB    90              nop
00496ACC    8D8D 04FEFFFF   lea ecx,dword ptr ss:[ebp-0x1FC]
00496AD2    33D2            xor edx,edx                              ; crackme.00416BD8
```

折腾半天之后，确实不会提示阅读密码错误了，但是点击“确定”之后，又毫无反应，也没有捕获到任何错误。到这里就毫无头绪了，尝试一步步跟“机器码”和“阅读码”的计算，也没发现什么突破口，应该就是我太菜了。真就是一顿操作猛如虎，最后像个二百五。

# 柳暗花明

因为自己技术实在不行，到这儿也开始打退堂鼓了。不过在放弃之前，还是想最后再试试看，能不能发现什么线索。之前一直都用的是`中文搜索引擎`，这次试一试原生搜索功能。原生搜索在`右键` > `查找` > `所有参考文本字串`可以找到。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_20.png)

Molebox？？这个东西在我以前搞魔塔的时候见过，有作者直接把RMXP游戏打包成一个exe文件，从而防止玩家随意篡改工程文件。当时只是以为在游戏领域有用，没想到能在这里再次见到。看来这加密PDF文件是有壳的啊！peid也太垃圾了吧，居然测不出来。

| 地址     | 反汇编                                      | 文本字符串                                                                |
|----------|---------------------------------------------|---------------------------------------------------------------------------|
| 004D98D3 | push crackme.004EB73C                       | ASCII "VirtualProtect"                                                    |
| 004D98E7 | push crackme.004EB72C                       | ASCII "VirtualQuery"                                                      |
| 004E40E4 | mov dword ptr ss:[ebp-0x4],crackme.004EBF54 | ASCII "VIRTUALPROTECT BROKEN"                                             |
| 004E21EA | push crackme.004EBD28                       | ASCII "D:\Projects\My.SRC\MoleStudio\MoleBox\molebox2\bootup\mbx_DLL.cpp" |

这回我找了`ExEinfoPE`来检测，试了两个版本，都回报`Molebox`，看来还是`peid`的问题了。而且是`Molebox`的话，我拆不出来那就太正常了~

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_21.png)

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/extract_encrypted_pdf_22.png)

知道是`Molebox 2.x`就好办了，网上都有现成的解包工具`demoleition v0.60`。我顺便去作者博客看了一眼，现在已经更新到`v0.64`了，不过`v0.60`应该已经足够。抱着试试的心态，我把加密文件拖进了解包工具。

```
[i] Loading file: C:\Users\*****\Desktop\crackme.exe
[+] MD5: e697f91b13068abac7d2c1d77ebd3edc
[i] Molebox Pro v2.2570
[i] MD5 check enabled. Decrypting control information, stage 2
[i] Overlay found
[i] MD5 check passed
[i] Decrypting File System
[i] Total files: 2
[i] Extracting china-drm.ini
[i] Extracting 数学120题.pdf
[i] Saving crackme_unpacked.exe
[i] Finished! Have a nice day!
```

居然成了。。。没想到逆向会以这种戏剧性的方式结束啊~

# 归根结底

这个东西按道理是肯定可以写出注册机的，据我步进跟踪的结果，最后应该是两个32位的hex在进行比较，但是既然已经有现成的工具，就没有继续深究。demoleition的原理当然无从得知，不过既然可以直接绕开密码，我猜可能可以在加密文件加载之后直接dump内存，然后把PDF文件扒出来吧，以后有空再试试了。

虽然说最后只看结果，但是过程也是很重要的，毕竟每一次的摸索都能提高对工具和汇编的熟悉程度~