module.exports = (api, options) => {
  api.injectImports(api.entryFile, `import router from '@/router'`)
  api.injectRootOptions(api.entryFile, `router`)

  api.extendPackage({
    dependencies: {
      'vue-router': '^3.2.0',
      'vue-router-layout': '^0.1.2',
    },
  })

  api.render('./template', {
    historyMode: options.historyMode,
    hasTypeScript: api.hasPlugin('typescript'),
  })

  if (api.invoking) {
    if (api.hasPlugin('typescript')) {
      api.postProcessFiles((files) => {
        delete files['src/router.ts']
      })

      /* eslint-disable-next-line node/no-extraneous-require */
      const convertFiles = require('@vue/cli-plugin-typescript/generator/convert')
      convertFiles(api)
    }
  }
}
