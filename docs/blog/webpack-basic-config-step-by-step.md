# webpack 基础配置

直接上代码吧还是，这里用的是 webpack4。据说 webpack5 就上了？

```cmd
cd spa-webpack
npm init -y
npm install webpack --save-dev
```

*此处需要提一句：如果是在国内，就翻墙吧；要么就用 CNPM，速度快。*

首先，我们先体验一下 webpack4 的 0 配置。

```javascript
// 简单配置一下package.json文件
"main": "index.js",
"scripts": {
+  "dev": "webpack --mode development",
+  "prod": "webpack --mode production"
},

// 在根目录下创建index.js，文件内容如下
console.log("hello nicolv")
```

截止目前目录结构是这个样子的：

spa-webpack  
　├ node-modules  
　├ src  
　│　├ index.js  
　├ package-lock.json  
　├ package.json  

```cmd
rem 运行一下webpack dev环境的配置
npm run dev

rem 此处会提示安装webpack-cli，官方文档也提到webpack和webpack-cli是一对好朋友，需要同时安装，按下yes继续

```

运行完之后，可以看到根目录下多了个 dist 文件夹，里面是在 webpack development mode 下处理完的结果。

spa-webpack  
　├ dist  
　│　├ main.js  
　├ node-modules  
　├ src  
　│　├ index.js  
　├ package-lock.json  
　├ package.json  

```cmd
rem 然后运行webpack prod
npm run prod
```

对比 0 配置下的 dev 和 prod 输出，dev 模式花费了较少的时间，输出了一个没有被压缩过的 main.js；prod 模式花费了较多的时间，输出了一个被压缩过的体积较小的 main.js。

dev
```plain
Hash: 3726ffe5c0575fcf34c9
Version: webpack 4.41.5
Time: 144ms
Built at: 2020-01-30 8:46:53 PM
  Asset     Size  Chunks             Chunk Names
main.js  3.8 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 27 bytes {main} [built]
```

prod
```plain
Hash: 2f69b8c440b53d5a812a
Version: webpack 4.41.5
Time: 584ms
Built at: 2020-01-30 8:56:55 PM
  Asset       Size  Chunks             Chunk Names
main.js  957 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 27 bytes {0} [built]
```

但 webpack 的 0 配置不止这些，还自带一个非常牛逼的功能————tree sharking。但是 webpack 的 0 配置中的 tree sharking 真的那么好用吗？

我们先体验一下它自带的 tree sharking。修改 src 目录下的文件，增加一个新的 js 文件 sync.js，并且修改 index.js 的内容。

```javascript
// index.js内容如下
import {sync} from "./components/sync"
sync()
console.log("hello nicolv")
```

```javascript
// sync/index.js文件内容如下
import lodash from "lodash-es"

var sync = function() {
    console.log("sync");
}

// 这个函数没被index.js使用到，所以应该被tree sharking掉
var noUseFun = function() {
    console.log("noUseFun");
}

// 这个函数也没被index.js使用到，所以也应该被tree sharking掉
// 同样，里面的lodash也没被用到，所以也应该被tree sharking掉
var noUseFun2 = function() {
    console.log("noUseFun2", lodash.isArray([]));
}

export {
    sync,
    noUseFun,
    noUseFun2
}
```

dev 模式
```plain
Hash: 1184af75f31e05d622aa
Version: webpack 4.41.5
Time: 2111ms
Built at: 2020-01-30 9:23:50 PM
  Asset      Size  Chunks             Chunk Names
main.js  1.41 MiB    main  [emitted]  main
Entrypoint main = main.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./node_modules/webpack/buildin/harmony-module.js] (webpack)/buildin/harmony-module.js 573 bytes {main} [built]
[./src/index.js] 75 bytes {main} [built]
    + 639 hidden modules
```

prod 模式
```plain
Hash: 000e36f361fa6727ac25
Version: webpack 4.41.5
Time: 5500ms
Built at: 2020-01-30 9:19:11 PM
  Asset      Size  Chunks             Chunk Names
main.js  85.6 KiB       0  [emitted]  main
Entrypoint main = main.js
[6] (webpack)/buildin/harmony-module.js 573 bytes {0} [built]
[7] (webpack)/buildin/global.js 472 bytes {0} [built]
[8] ./src/index.js + 611 modules 572 KiB {0} [built]
    | ./src/index.js 75 bytes [built]
    |     + 611 hidden modules
    + 28 hidden modules
```

dev 模式用了 2 秒，产出了个 1M 多的文件。prod 模式用了 5 秒，产出了个 85K 的文件。打开产出物 main.js 查看：dev 模式保留了所有的函数定义，包括整个 lodash-es。prod 模式，并没有搜索到 noUseFun 和 noUseFun2 的定义，但是却看到了整个 lodash-es，所以文件很大。为什么 lodash-es 没有被 tree sharking 掉？因为在 0 配置的 webpack production 模式中，webpack 无法判断函数式编程的 lodash-es 是否被使用（纯函数驱动、颗粒化函数改变业务时，才考虑它），webpack 无法 tree sharking 到函数式作用域之内的东西。（类和块都是构建作用域的）

那么，怎么去掉这个没用到的 lodash-es 呢？
好用的插件 1：webpack-deep-scope-plugin
此插件能深度分析作用域，怎么实现的看源码。

```cmd
npm install webpack-deep-scope-plugin --save-dev
```

在根目录下增加 webpack.config.js，配置它：
```javascript
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;

module.exports = {
    plugins: [
        new WebpackDeepScopeAnalysisPlugin(),
    ],
}
```

再次运行 npm run prod
```plain
Hash: 31e28397f18aa8b07e69
Version: webpack 4.41.5
Time: 2438ms
Built at: 2020-01-30 10:00:25 PM
  Asset        Size  Chunks             Chunk Names
main.js  1010 bytes       0  [emitted]  main
Entrypoint main = main.js
  [0] ./src/index.js + 1 modules 602 bytes {0} [built]
      | ./src/index.js 75 bytes [built]
      |     + 1 hidden module
[639] (webpack)/buildin/global.js 472 bytes [built]
[640] (webpack)/buildin/harmony-module.js 573 bytes [built]
    + 638 hidden modules
```

体积从 85K 锐减到 1k；打开 main.js 查看，发现 lodash 不见了。完美！