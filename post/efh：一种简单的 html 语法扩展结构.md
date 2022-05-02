```
发布日期: 2021-12-16 22:51
最近更新: 2021-12-26 14:45
文章地址: https://elecv2.github.io/#efh：一种简单的%20html%20语法扩展结构

一个不成熟的想法：在 html 中插入后台脚本，实现在同文件中编写前端和后端代码。
```

### 基础结构

efh - extended from html, 一种简单的 html 扩展格式，或者说是一个文件协议或标准，基础结构如下：

``` xml
<div>原来的 html 格式/标签/内容</div>
<script type="text/javascript">
  console.log('原 html 页面中的 script 标签')
</script>
<!-- 上面为原 html 页面，下面为扩展部分 -->
<script type="text/javascript" runon="backend">
  console.log('efh 文件的扩展部分')
</script>
```

简单来说就是在原 html 的基础上加上一段运行在后台的代码，这段代码写在 \<script\> 标签中，由 **runon** 属性关键字来区分。
一些基本特性：

- 前端部分保持为原来的 html
- 后台 runon 对应关键字可自定义，比如 backend/nodejs/cloud 等等
- 后台语言也可以自义，比如使用 nodejs/php/python/go 等等
- 后台 script 标签支持使用 src 属性，表示使用远程脚本文件
- 前后端可以根据平台需要/特性，插入一些默认函数

为了简化前后端逻辑，增加以下限制：

- 接收到 GET 请求时，直接返回前端代码
- 接收到 POST 请求时，运行后台代码并返回最终结果

### 产生原因

当前端开发者需要知道后台传送的数据结构/内容时，通常得先调试，查找文档，或者和后台开发者进行沟通，比较费时费力，如果想要对后台 API 进行修改则更加不可能。
通过引入 efh 这种文件结构，前端开发者可以同时编写后台程序，自主设计后台返回数据（做一名真正的全栈工程师）。
另外，静态网站平台也可以通过此种方式，开放部分后台权限给开发者，提升静态网站的交互性。

### 执行原理

执行过程/基本原理:

- 首次执行 .efh 文件时，先将 efh 文件分离为**前端和后端**，并进行缓存
- （再次访问时，检测缓存是否过期。过期则回到第一步，否则执行下一步）
- 然后当接收到 GET 请求时，则直接返回**前端**代码（html 部分）
- 当接收到 POST 请求时，执行**后端**代码并返回执行结果（后台 API/数据部分）

### 适用范围

适用于提供脚本运行的轻量云平台，比如 cloudflare worker/heroku/netlify/Google script 等（只是比如，并不表示这些平台一定会支持）。通常这些平台都是运行一些单文件脚本，或者只支持静态文件，开发者对后台数据的控制有限，或者说比较麻烦。

假如平台要支持 efh 文件/协议，可能需要额外做以下一些事情：

- 分离 efh 文件中的前后端代码（可以在用户编辑保存时完成
- 一个后台代码的执行环境（可以是 node/php/python/go 等
- 增加一些前后端默认函数，方便开发者编写脚本（可选

### 简单实现

以 nodejs 平台为例，作一个简单的应用示例。

需要外部模块:

- express
- cheerio

项目目录:

- main.js
- test.efh

main.js 内容如下：

``` JS main.js
const fs = require('fs');
const express = require('express');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());
app.use('/', (req, res)=>{
  let efhc = efhParse('test.efh');
  if (req.method === 'POST') {
    console.log('run efh backend with', req.body);
    res.send(runBackend(efhc.script, req.body));
  } else {
    console.log('send html directly');
    res.send(efhc.html);
  }
});
app.listen(3000, ()=>console.log('efh start on localhost:3000'));

const efhcache = new Map();
function efhParse(filename) {
  // efh 文件前后端分离及缓存
  let efhc = { date: 0, html: '', script: '' };
  if (!fs.existsSync(filename)) {
    efhc.html = filename + ' not exist';
    return efhc;
  }
  let tdate = fs.statSync(filename).mtimeMs;
  if (efhcache.has(filename)) {
    efhc = efhcache.get(filename);
    if (efhc.date === tdate) {
      console.log('run', filename, 'with cache');
    } else {
      // 非最新文件缓存，清空内容
      efhc.date = tdate;
      efhc.html = '';
      efhc.script = '';
    }
  } else {
    efhc.date = tdate;
    efhcache.set(filename, efhc);
  }
  if (!efhc.html) {
    let efhcont = fs.readFileSync(filename, 'utf8');
    if (!efhcont) {
      efhc.html = filename + ' not exist';
      console.log(efhc.html);
    } else {
      console.log('deal', filename, 'content');
      let $ = cheerio.load(efhcont);
      let bcode = $("script[runon='backend']");
      efhc.script = bcode.html();
      bcode.remove();
      efhc.html = $.html();
    }
  }
  return efhc;
}

const vm = require('vm');
function runBackend(code, data) {
  // 后台代码运行函数。可根据需求或平台特性进行自定义
  // 为简化说明，以 node 平台的 vm 模块作为示例
  // 定义 $env 参数将前端发送的数据传输给后台进行处理
  console.log('收到前端传输的数据：', data);
  return vm.runInNewContext(code, { $env: data });
}
```

test.efh 内容如下：

``` XML test.efh
<h3>efh - extended from html, 一种同时包含前后端运行代码的 html 扩展格式</h3>
<p>说明: https://elecv2.github.io/#efh：一种简单的%20html%20语法扩展结构</p>
<div>
  <label>请求后台数据测试</label>
  <button onclick="dataFetch()">获取</button>
</div>
<script type="text/javascript">
  console.log('前端部分完全等同于原来的 html');
  async function dataFetch() {
    let data = await fetch('', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "data": "一些传输给后台的数据" })
    }).then(res=>res.text()).catch(e=>console.error(e));
    console.log(data);
    alert(data);
  }
</script>

<script type="text/javascript" runon="backend">
  // 使用 runon="backend" 属性来表示此部分是运行在后台的代码
  console.log('后台 JS, 接收到数据：', $env);
  // 以下为返回给前端的数据（自定义 API
  'hello, ' + JSON.stringify($env);
</script>
```

文件准备好后，使用 **node main.js** 开始程序。
在浏览器中打开 localhost:3000，可看到 **test.efh** 的前端部分(html)。
然后测试请求后台数据，可获取 **test.efh** 后台代码执行的结果。
然后修改 test.efh 文件内容，对前端和后台返回数据进行各种测试。

在实际实用时可能还需对一些特殊情况进行处理，比如：

- 当后台 script 标签有 src 属性时
- efh 文件为远程或原生代码的情况
- 具体执行文件可通过 req 的某些参数来调整，不一定要是 test.efh
- 前后端通信可设置一些默认函数进行优化
- 其他，像后台代码可使用 PHP/python 等，处理结果为 function/promise/async 形式等
- 总之，这只是 efh 文件协议的初版/基本构思，还有许多待完善的地方

### 参考资料

- https://github.com/elecV2/elecV2P-dei/blob/master/docs/dev_note/favend%20JS%20重构-efh.md