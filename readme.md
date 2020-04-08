## eleCBlog 简介

一个纯 JS 实现的静态博客系统。花了差不多两个晚上写的，很简陋，完全称不上是“系统”，但找不到一个合适的叫法，就姑且这么称呼吧。

## 基本原理

文章获取是通过 404 重定向到主页，通过 pathname 获取文章名，然后 fectch 获取文章内容（.md）（文章全部为 markdown 格式，放置在 **post** 目录下）获取的内容通过 JS [marked](https://github.com/markedjs/marked) 转化为 html。

## 目录结构

```
┌─index.html    
├─config.json  // 基础配置文件
├─post         // 文章发表目录
├──├──_lists.json    // 文章列表
├──├──about.md       // 发表文章
├─css
├─js
├─src          // 图片等资源
└──├──...
   ├──...
```

## 优点：能用

- 源码简单，支持 markdown

## 缺点：很多

- 文章内容页面默认返回 404
- 文章获取是通过 JS fetch 的模式，搜索引擎的收录可能很不好
- 文章放置在 post 目录，另外如果不在 _lists.json 中添加一下的，首页无法显示
- 缺点真的还有很多

## why

想用 github 搭建一个简单的静态博客，发现 Jekyll/hexo 等都还是比较复杂，要 nodejs，要各种指令操作，最主要的是：.md 文件还要经过一定的修改，才能最终展现出来，很不友好。我希望的是写一份 .md 文件，拿到哪都能用，而不是被各种格式反复污染。

## 引用参与

- JS: [marked](https://github.com/markedjs/marked)
- CSS: [markdownhere](https://gist.github.com/xiaolai/aa190255b7dde302d10208ae247fc9f2)