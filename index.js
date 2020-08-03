const webpackChokidarPlugin = require('webpack-chokidar-plugin')
const generatorRouter = require('./router/generatorRouter')

const defaultOptions = {
  chunkNamePrefix: 'page-',
  pages: 'src/views',
  importPrefix: '@/views/',
}

module.exports = (api, options) => {
  const pluginOptions = {
    ...defaultOptions,
    ...(options.pluginOptions && options.pluginOptions.autoRouting),
  }

  api.chainWebpack((webpackConfig) => {
    let isReady = false

    // prettier-ignore
    webpackConfig
      .plugin('chokidar')
        .use(new webpackChokidarPlugin({
          watchFilePaths: [
            'src/views/**/*.vue', 'src/view/**/*.ts'
          ], 
          onReadyCallback: () => {
            isReady = true
          }, 
          onChangeCallback: () => { return null },
          onAddCallback: () => {
            if (isReady) {
              generatorRouter(pluginOptions)
            }
          },
          onUnlinkCallback: () => {
            generatorRouter(pluginOptions)
          },
          usePolling: false,
          ignored: '/node_modules/',
      }))

    // prettier-ignore
    webpackConfig.module
      .rule('route-meta')
      .post()
      .resourceQuery(/blockType=route-meta/)
      .use('route-meta')
        .loader('vue-cli-plugin-auto-routing/route-loader')

    // prettier-ignore
    webpackConfig.module
      .rule('route')
      .post()
      .resourceQuery(/blockType=route/)
      .use('route')
        .loader('vue-cli-plugin-auto-routing/route-loader')
  })
}
