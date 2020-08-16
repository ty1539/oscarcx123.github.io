---
title: 用Travis-CI构建Hexo博客
date: 2020-08-09 15:23:47
categories:
  - 技术
---

在用过Travis-CI之后，我只能说太香了！

<!--more-->

# 前情提要

最近换了操作系统，Hexo博客的环境自然也就没了，需要重新搭建。本来这事儿应该很容易的，只需要在博客源文件的根目录跑下面的命令就可以了。

```
sudo npm install hexo-cli -g
npm install
```

然而问题来了，搞定博客所需的环境后，`hexo g`和`hexo s --debug`居然会出现Warning，然后`hexo d`居然直接报错。之后我尝试重装Hexo博客的环境，还是报错。于是我就去[Hexo项目主页](https://github.com/hexojs/hexo)搜了下issue，发现已经有人提过了，讨论比较多的是[Regression in Node 14 (issue #4260)](https://github.com/facebook/docusaurus/issues/4260)。在这个issue讨论的最后，开发团队说已经在`v4.2.1`的Hexo修复了这个问题。

由于我之前部署的是`v4.2.0`的Hexo，那就升级呗。结果兴冲冲升级到最新的`v5.0.0`，发现还是报同样的错误，看来只能选择降低nodejs版本了。因为我不想在机子上装好几个nodejs环境，于是就打起了虚拟机的主意。刚刚好那会儿在跟zhaouv聊天，就顺便说了这事儿。zhaouv一针见血的指出，这种情况就是docker的典型应用。不过更直接的还是使用Travis-CI，这样就可以绕过自己学docker这一步，毕竟GitHub现在可以先build，跟gitlab那套基本一样了。

# Travis-CI入门

首先当然是要用GitHub帐号登录Travis-CI，然后完成一系列的授权，就可以在Travis-CI看到自己全部repo了。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/hexo_and_travis_ci_1.png)

不过此时Travis-CI还没有权限对我们的repo进行操作，因此我们还需要在GitHub生成[Personal access tokens](https://github.com/settings/tokens)。在Select scopes这里可以勾选对应的权限，这里勾选repo就可以了（Full control of private repositories）。提交之后GitHub会生成一个token，这个token只会显示一次，如果忘了复制那就只能重新生成。

接下来点击自己的博客项目，然后在More options > Settings里头找到Environment Variables。这里需要把刚刚获得的token添加为环境变量，记得再三确认Display Value In Build Log这个是否为关闭状态。

![](https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/img/hexo_and_travis_ci_2.png)

到这里Travis-CI就配置好了，现在需要在博客repo内提供一个`.travis.yml`，这样Travis-CI就知道在监听到push之后要干啥。这里提供本博客使用的`.travis.yml`。

```yml
language: node_js
node_js: lts/*

branches:
  only:
    - hexo_source

cache:
  directories:
    - node_modules
 
before_install:
  - export TZ='America/New_York'

install:
  - npm install -g hexo-cli
  - npm install

script:
  - hexo clean
  - hexo generate

after_script:
  - git config --local user.name "travis-ci"
  - git config --local user.email "deploy@travis-ci.org"
  - sed -i "s/github_repo_token/${GITHUB_REPO_TOKEN}/g" ./_config.yml
  - hexo deploy
```

当然我们还需要修改`_config.yml`以适配Travis-CI的自动化部署。

```yml
# 修改前
deploy:
  type: git
  repo: https://git@github.com/oscarcx123/oscarcx123.github.io.git
  branch: master

# 修改后（github_repo_token在构建时会被sed命令自动替换掉）
deploy:
  type: git
  repo: https://github_repo_token@github.com/oscarcx123/oscarcx123.github.io.git
  branch: master
```

搞定`.travis.yml`之后，只要push，Travis-CI就会自动生成Hexo博客页面并push到指定的repo了。在生成的过程中，还可以去Travis-CI网站观看实时的Job log。

# .travis.yml写法

上面那个脚本没有指定`os`和`dist`，因此他们的默认值分别是`Linux`和`Xenial`，也就是Ubuntu 16.04 LTS (Xenial Xerus)。所以里头使用的都是Linux命令，例如用`sed`去动态的正则替换token，用`export`指定环境变量。

完整的可配置项目清单可以看[Travis CI Build Config Reference](https://config.travis-ci.com/)

Travis-CI主要构建顺序：
* before_install
* install
* before_script
* script
* after_success / after_failure
* deploy
* after_script

完整的构建顺序可以看[Job Lifecycle](https://docs.travis-ci.com/user/job-lifecycle/#the-job-lifecycle)

当然，Hexo博客是个JavaScript项目，所以跟nodejs一些相关的配置（例如nodejs指定版本号），可以在[Building a JavaScript and Node.js project](https://docs.travis-ci.com/user/languages/javascript-with-nodejs/)看到。

# 总结

Travis-CI听起来很复杂，实际上还是很好配置的。现在我本地就完全不需要安装相关环境，也无需担心某些包的升级会破坏环境。每次只需要写博客，写完之后push，过个一两分钟博客就更新了。

（更棒的是，Travis-CI可以白嫖，而且我又水了一篇文章）