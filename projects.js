/*
 * @Author: zxx
 * @Date: 2021-11-09 13:42:33
 * @LastEditors: zxx
 * @LastEditTime: 2021-11-09 15:48:00
 * @FilePath: \multi-projects-template\projects.js
 * @Description: some description
 */
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
  // 必须, 否则页面空白, 参考: https://blog.csdn.net/weixin_43405848/article/details/120371626
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
