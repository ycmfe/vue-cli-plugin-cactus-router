const webpackChokidarPlugin = require('webpack-chokidar-plugin')
const generatorRouter = require('./router/generatorRouter')

const defaultOptions = {
  chunkNamePrefix: 'page-',
  pages: 'src/views',
  importPrefix: '@/views/',
  patterns: [
    '**/*.vue',
    '!**/__*__.vue',
    '!**/__*__/**',
    '!**/components/**',
    '!**/assets/**',
    '!**/services/**',
    '!**/config/**',
    '!**/config.vue',
    '!**/point/**',
    '!**/point.vue',
  ]
}

module.exports = (api, options) => {
  const pluginOptions = {
    ...defaultOptions,
    ...(options.pluginOptions && options.pluginOptions.autoRouting),
  }

  api.chainWebpack((webpackConfig) => {
    webpackConfig.when(
      process.env.NODE_ENV === 'development',
      (config) => {
        let isReady = false

        config.plugin('chokidar').use(
          new webpackChokidarPlugin({
            watchFilePaths: ['src/views/**/*.vue', 'src/view/**/*.ts'],
            onReadyCallback: () => {
              isReady = true
            },
            onChangeCallback: () => {
              return null
            },
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
          })
        )
      },
      (config) => {
        config.plugin('vue-auto-routing').use({
          apply(compiler) {
            compiler.hooks.thisCompilation.tap('VueAutoRoutingPlugin', (compilation) => {
              try {
                generatorRouter(pluginOptions)
              } catch (error) {
                compilation.errors.push(error)
              }
            })
          },
        })
      }
    )

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
