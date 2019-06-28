const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  baseUrl: "./",
  runtimeCompiler: false,
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
    // host: 'webgis.kissxxx.top',
    // port: 8080,
    proxy: {
      '/api': {
        // target: 'http://webgis.kissxxx.top:8080/',  // target host
        target: 'http://localhost:8080/',  // target host
        changeOrigin: true,  // needed for virtual hosted sites
        pathRewrite: {
          '^/api': ''  // rewrite path
        }
      },
    },  
  }
}