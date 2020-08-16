---
title: Hexo生成自定义sitemap
date: 2020-08-16 04:52:39
categories:
  - 技术
tags:
  - Hexo
---
这两天心血来潮搜了下自己博客，发现没被Google收录，看了一些文章后发现需要提交sitemap，从而让Google知道要抓取哪些网页。

<!--more-->

hexo开发团队提供了[hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap)这个插件，默认是生成全站sitemap的，毕竟正常情况下肯定希望尽可能多的页面被Google收录。但是我这博客里头除了技术文章，还有不少随笔以及从老博客迁移来的文章。因为我的博客首页也做了filter，只显示技术分类下的文章，也是希望分享自己所学所得，如果Google收录了随笔就有点本末倒置的感觉。官方这个插件倒是有exclude post的功能，不过需要在对应文章开头加上`sitemap: false`。我这一大堆文章一个个添加这个tag，显然不靠谱。。。那么只剩下一条路，也就是改插件了。

（不折腾又怎么水文章呢？）

# 安装插件

在push到travis-CI构建之前，还是需要本地修改测试的，所以先用下面命令安装

```
npm install hexo-generator-sitemap
```

然后在Hexo博客根目录的`_config.yml`把`url`替换成自己的域名，还需要在next主题根目录的`_config.yml`找到`menu` > `sitemap`，取消掉注释。

只要运行`hexo g`就会在`public`目录下生成`sitemap.xml`。

# 插件目录结构

安装之后`hexo-generator-sitemap`目录结构如下

```
./
├── index.js
├── lib
│   ├── generator.js
│   ├── rel.js
│   └── template.js
├── LICENSE
├── package.json
├── README.md
└── sitemap.xml

1 directory, 8 files
```

# 尝试修改sitemap.xml

这个`sitemap.xml`比较可疑，点开一看就发现是类似脚本的东西，查了下叫`nunjucks`。这段代码不仅收录全部文章，而且还收录categories和tags的页面，那肯定首先就得把`{% for tag in tags %}`和`{% for cat in categories %}`删掉。删完之后如下所示

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in posts %}
  <url>
    <loc>{{ post.permalink | uriencode }}</loc>
    {% if post.updated %}
    <lastmod>{{ post.updated | formatDate }}</lastmod>
    {% elif post.date %}
    <lastmod>{{ post.date | formatDate }}</lastmod>
    {% endif %}
  </url>
  {% endfor %}

  <url>
    <loc>{{ config.url | uriencode }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

这里很明显就是在遍历posts，所以做个筛选应该就行了，然后就发现事情好像没有那么简单。。。

```bash
# 试图直接对categories筛选
{% if post.categories == '技术' %}
> 啥也没生成

# 试图打印categories
<loc>{{ post.categories }}</loc>
> <loc>[object Object]</loc>

# 在网上看到说要取data
<loc>{{ post.categories.data }}</loc>
> FATAL {
  err: Template render error: (unknown path)
    TypeError: Converting circular structure to JSON
      --> starting at object with constructor '_Document'
      |     property 'tags' -> object with constructor '_Query'
      |     property 'data' -> object with constructor 'Array'
      |     ...
      |     property 'data' -> object with constructor 'Array'
      --- index 0 closes the circle
```

于是我又去翻了[Hexo文档](https://hexo.io/docs/variables)，结果文档也是一样的坑，写了跟没写一样。。。

| Variable        | Description                | Type         |
|-----------------|----------------------------|--------------|
| page.categories | All categories of the post | array of ??? |

看来还是得从插件源码下手了。

# 查看generator.js

前面提到过`sitemap: false`，所以下面这段就特别显眼。而且这是js，可以用`console.log`而不是`{{ cmd }}`了！

```js
const posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(post => {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .sort((a, b) => {
      return b.updated - a.updated;
    });
```

运行`hexo g --debug`，然后在return之前打印`post.categories`，就能看见真面目了。值得注意的是，除了类似下面的数据结构，还返回了几个`undefined`，应该是一些自动生成的页面，例如`tags`和`categories`筛选页面。

```js
_Query {
  data: [
    _Document {
      name: '技术',
      _id: 'ckdr16z0h002zcua91krp7itc',
      slug: [Getter],
      path: [Getter],
      permalink: [Getter],
      posts: [Getter],
      length: [Getter]
    }
  ],
  length: 1
}
```

所以这里有两种方式把category数据抽出来

```js
if (post.categories !== undefined) {
  // 方法一
  post.categories.forEach(function(item){
    console.log(item.name);
  });

  // 方法二
  console.log(post.categories.data[0].name)
}
```

# 自定义sitemap.xml

不过我的博客是通过Travis-CI构建的，这些npm包都是在那边安装，我这边本地改了代码也不管用，因此需要自定义sitemap.xml。

在Hexo博客根目录的`_config.yml`添加下面内容

```yml
# sitemap
sitemap:
  template: ./source/.sitemap.xml
```

然后新建`./source/.sitemap.xml`，写入下面内容。我这里直接取的第一个category，其实不太妥当，不过我自己的文章全都只有一个分类，所以无所谓。值得注意的是，`nunjucks`多个条件判断用的是`and / or`而不是`&& / ||`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in posts %}{% if post.categories !== undefined and post.categories.data[0].name == '技术' %}
  <url>
    <loc>{{ post.permalink | uriencode }}</loc>
    {% if post.updated %}
    <lastmod>{{ post.updated | formatDate }}</lastmod>
    {% elif post.date %}
    <lastmod>{{ post.date | formatDate }}</lastmod>
    {% endif %}
  </url>
  {% endif %}{% endfor %}
  
  <url>
    <loc>{{ config.url | uriencode }}</loc>
    <lastmod>{{ sNow | formatDate }}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

# Google收录

未完待续。。。