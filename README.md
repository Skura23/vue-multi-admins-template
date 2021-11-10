## 太长不看
clone本代码库, main分支为基于vue-admin-template的模板, br1分支为基于vue-element-admin的模板, 根据需要clone

使用方法在文档最后[使用](#usage)

## 需求
vue多个项目开发时, 存在项目内资源共用的问题, 解决方案一般有两个,
1, 每个项目独立开发, 公用资源通过npm打包发布到私人或公用npm服务器, 使用时引用这些npm包
2, 多个项目集成到一个根项目里, 每个子项目可单独运行打包, 也可直接运行打包由子项目集成的根项目
本文介绍方案2
## 说明
为适用公司业务, 项目基于[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)集成, 基于其他项目的话原理是一样的

## 项目结构
![红框从上到下](https://img-blog.csdnimg.cn/55fe82d78a1d498180fb636e58304d9d.png)
(红框从上到下依次为子项目文件, 公共资源区, 根项目配置区)
 `/apps`文件夹存放子项目, 子项目内结构与根项目`src`文件夹内结构相同, 实际配置的时候可直接复制根项目`src`文件夹内容到子项目内
## 搭建流程
**1,  本地安装运行vue-admin-template**

git clone https://github.com/PanJiaChen/vue-admin-template.git

cd vue-admin-template

npm install

npm run dev

**2, 创建子项目**
直接复制根项目`src`文件夹内容到子项目内, 再在子项目目录内添加`index.html`和`test-app.html`, 两文件内容相同, 内容可直接从`public/index.html`里复制, 前者是单个子项目运行打包时的页面入口, 后者是根项目运行打包时的页面入口

**3, 根目录下添加 /projects.js**

```javascript
let path = require('path')
let glob = require('glob')
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = basename; // 正确输出js和html的路径

    entries[pathname] = {
      entry: 'src/' + tmp[0] + '/' + tmp[1] + '/main.js',
      template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
      title:  tmp[2],
      filename: tmp[2] //如test-app.html, 为根项目不同页面配置信息
    };
  });
  return entries;
}
let pages = getEntry('./src/apps/**?/*.html');
pages['index'] = {
  // pages 的入口
  entry: 'src/main.js',
  // 模板来源
  template: 'public/index.html',
  // 在 dist/index.html 的输出
  filename: 'index.html',
  // 当使用 title 选项时，
  // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  title: '公共首页',
  // 在这个页面中包含的块，默认情况下会包含
  // 提取出来的通用 chunk 和 vendor chunk。
  // chunks: ['chunk-vendors', 'chunk-common', 'index']
  // 必须, 否则打包时页面空白, 参考: https://blog.csdn.net/weixin_43405848/article/details/120371626
  chunks: ['chunk-libs', 'chunk-vendors','chunk-commons', 'chunk-elementUI', 'index', 'runtime', 'manifest']
};

const config = {
  all: {
    pages
  },
  'test-app': {
    pages: {
      index: {
        entry: "src/apps/test-app/main.js",
        template: "src/apps/test-app/index.html",
        filename: "index.html",
         // 必须, 否则打包时页面空白, 参考: https://blog.csdn.net/weixin_43405848/article/details/120371626
        chunks: ['chunk-libs', 'chunk-vendors','chunk-commons', 'chunk-elementUI', 'index', 'runtime', 'manifest']
      }
    },
    outputDir: "dist/test-app/"
  },
  // 新子项目在这里配置
  'test-app1': {},
  'test-app2': {},
  
};

module.exports = config;
```
**4, 修改 /vue.config.js**

```javascript
const projectsConfig = require("./projects.js");
/*
	npm run serve 就是all,否则是后接子系统名称
*/
let projectName = (!process.env.VUE_APP_PROJECT_NAME || process.env.VUE_APP_PROJECT_NAME.length === 0)
 ? 'all' : process.env.VUE_APP_PROJECT_NAME;
 
module.exports = {
  // 注意, 此句要放在outputDir: 'dist'配置项后面以将其覆盖, 否则打包不会按项目划分目录
  ...projectsConfig[projectName],
  
  // 注意, 需注释掉config.plugin('preload')配置项, 否则运行会报错
  // 注意, 注释掉config.plugin('ScriptExtHtmlWebpackPlugin')那段代码, 否则打包后项目会有部分打包文件的报错信息, 参考: https://github.com/PanJiaChen/vue-admin-template/issues/593
}



```
这里环境变量需要是VUE_APP_XXX形式, 因为vue-admin模板基于vue-cli开发, 而vue-cli对环境变量设置做了如下规定, 具体可参看文档[vue-cli环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

> 请注意，只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin
> 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。
> 
意思就是说vuecli项目里的用户环境变量名必须加上VUE_APP_前缀, 否则在项目里获取不到



然后为子项目配置快捷路径, 在子项目文件里全局替换`@/`路径为`@test/`路径
```javascript
configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@test': resolve('src/apps/test-app')
      },
    }
  },

```


**5, 修改 /package.json**

```javascript
"scripts": {
    "dev": "vue-cli-service serve",
    "dev:test-app": "cross-env VUE_APP_PROJECT_NAME=test-app vue-cli-service serve --open",
    "build:test-app": "cross-env VUE_APP_PROJECT_NAME=test-app vue-cli-service build",
  },
```
需要安装 cross-env
npm i --save-dev cross-env

**6, 运行**
运行根项目: `npm run serve`
运行子项目: `npm run dev:test-app`

##  <span id="usage">使用</span>
以上是多项目集成项目搭建流程, 下面是项目使用
### 运行

```bash
git clone git@github.com:Skura23/vue-multi-admins-template.git

# install dependency
npm install

# 运行对应项目, 以test-app为例
npm run dev:test-app

```


### 打包

```bash
# 打包对应项目, 以test-app为例
npm run build:test-app
```

### 配置

#### 新增子项目:

```bash

/src/apps 下新建xxx-app文件夹, 此处放入项目代码文件夹, 增加index.html和xxx-app.html, 两文件内容相同

/projects.js
const config = {
    ...
    'xxx-app':{
    pages: {
      index: {
        entry: "src/apps/xxx-app/main.js",
        template: "src/apps/xxx-app/index.html",
        filename: "index.html"
      }
    },
    outputDir: "dist/xxx-app/"
  },
    ...
}

/vue.config.js
configureWebpack.resolve.alias处为不同子项目配置快捷路径

/.env.development /.env.production 处为不同子项目设置环境变量VUE_APP_BASE_API
VUE_APP_BASE_API_xxx-app = '/your_url'
此环境变量调用方式为: process.env[`VUE_APP_BASE_API_${process.env.VUE_APP_PROJECT_NAME}`]


```