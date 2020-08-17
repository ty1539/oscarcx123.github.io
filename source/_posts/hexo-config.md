---
title: Hexo博客个性化
date: 2020-08-17 00:57:02
categories:
  - 技术
tags:
  - Hexo
---
个性化的内容越来越多，About页面放不下了，于是决定单独写一篇文章记录本博客的配置

<!--more-->

# 主题

[NexT.Gemini](https://github.com/theme-next/hexo-theme-next)
* 版本：v7.7.1
* 手动修复了[issue #1543：中文目录无法跳转，英文可以跳转](https://github.com/theme-next/hexo-theme-next/issues/1543)

## 具体Patch

中文目录无法跳转，英文可以跳转，应该是Hexo升级到v5.0.0造成的

对next主题目录下source/js/utils.js的registerSidebarTOC函数做两处修改

```js
// 修改前
var target = document.getElementById(event.currentTarget.getAttribute('href').replace('#', ''));
return document.getElementById(link.getAttribute('href').replace('#', ''));
// 修改后
var target = document.getElementById(decodeURI(event.currentTarget.getAttribute('href').replace('#', '')));
return document.getElementById(decodeURI(link.getAttribute('href').replace('#', '')));
```

# 音乐播放器

[APlayer](https://github.com/MoePlayer/APlayer)
* 版本：v1.10.1
* 安装方法：把该项目的dist文件夹复制到themes\next\source
* 页面跳转不打断播放（[theme-next-pjax](https://github.com/theme-next/theme-next-pjax)）

使用csv文件来管理曲库，配合Python脚本自动生成`music.js`

## 自动生成music.js

这里给出我写的代码，仅供参考

```py
import csv
import json

filename = 'SOME_CSV_FILE'
repo_url = 'SOME_URL'

# 从csv读取name和artist并去掉表头
with open(filename) as f:
    reader = csv.reader(f)
    music_list = list(reader)[1:]

# 生成JSON对象
result = []
for i in range(len(music_list)):
    data = {}
    data['name'] = music_list[i][0]
    data['artist'] = music_list[i][1]
    data['url'] = repo_url + 'song/' + music_list[i][0] + '.mp3'
    data['cover'] = repo_url + 'cover/' + music_list[i][0] + '.jpg'
    result.append(data)

# 写入music.js
with open('music.js', 'w') as f:
    f.writelines([
        "const ap = new APlayer({" + "\n",
        "    container: document.getElementById('aplayer')," + "\n",
        "    fixed: true," + "\n",
        "    autoplay: false," + "\n",
        "    order: 'random'," + "\n",
        "    audio: ",
    ])
    json.dump(result, f, ensure_ascii=False, sort_keys=False, indent=4)
    f.write("});")
```

# 字数统计和阅读时长

[hexo-symbols-count-time](https://github.com/theme-next/hexo-symbols-count-time)
* 版本：v0.7.0
* 代码块不计入字数（exclude_codeblock: true）

# 动态背景

[theme-next-canvas-nest](https://github.com/theme-next/theme-next-canvas-nest)

# 阅读进度条

next主题的_config.yml里找到Reading progress bar开启

# 隐藏部分分类（比如随笔）

[hexo-generator-index2](https://github.com/Jamling/hexo-generator-index2)
* 版本：v0.2.0

# 禁用更新日期

next主题的_config.yml > post_meta > updated_at > enable: false

# 全英语链接

全英语链接方便搜索引擎收录，这里简单修改hexo站点的`_config.yml`即可，下面给出本博客的配置

我的`.md`文件名都是英语，所以URL > permalink可以设置为`:category/:title.html`

文章的类别大多都是中文名，可以通过Category & Tag > category_map进行映射

```yml
# URL
:category/:title.html

# Category & Tag
category_map:
  随笔: essay
  技术: tech
  开箱: unbox
```