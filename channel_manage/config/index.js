// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var url = 'http://192.168.100.131:5000'
url = 'http://qudao-test.zuoyetong.com.cn'
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../frontend/index.html'),
    assetsRoot: path.resolve(__dirname, '../frontend'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    proxyTable: {
      '/api': {
        target: url,
        changeOrigin: true,
        pathRewrite: {
        }
      },
      '/accounts': {
        target: url,
        changeOrigin: true,
        pathRewrite: {
        }
      },
      '/schools': {
        target: url,
        changeOrigin: true,
        pathRewrite: {
        }
      },
      '/files': {
        target: url,
        changeOrigin: true,
        pathRewrite: {
        }
      },

    }
  }
}
