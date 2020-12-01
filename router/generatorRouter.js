const fs = require('fs')
const path = require('path')
const { generateRoutes } = require('@ycmfe/vue-route-generator')
const { chalk, error } = require('@vue/cli-shared-utils')

module.exports = function generateRouterFile(options) {
  try {
    const code = generateRoutes(options)
    const to = path.resolve(__dirname, './index.js')
    if (fs.existsSync(to) && fs.readFileSync(to, 'utf8').trim() === code.trim()) {
      return
    }
    fs.writeFileSync(to, code)
    const now = new Date()
    console.log(chalk.green(`${now.getHours()}:${now.getMinutes()}  路由重新生成`))
  } catch (err) {
    error(err)
  }
}
