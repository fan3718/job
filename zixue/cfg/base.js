'use strict';
let path = require('path');
let defaultSettings = require('./defaults');
let autoprefixer = require('autoprefixer');
// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'zixue.js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false,
    proxy: {
        '/selfstudy/exam/structure':{
        target: 'https://xyt.zuoyetong.com.cn',
        changeOrigin: true
        },
        '/selfstudy/exam/ques/detail':{
          target: 'https://xyt.zuoyetong.com.cn',
          changeOrigin: true
        },
        '/selfstudy/exam/ques/commit':{
          target: 'https://xyt.zuoyetong.com.cn',
          changeOrigin: true
        },
        '/selfstudy/exam/commit':{
          target: 'https://xyt.zuoyetong.com.cn',
          changeOrigin: true
        },
        '/cart':'http://localhost:9000'
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      sources: `${defaultSettings.srcPath}/sources/`,
      stores: `${defaultSettings.srcPath}/stores/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {},
  postcss: function () {
        return [autoprefixer];
  }
};
