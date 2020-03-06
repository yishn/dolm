const {readFileSync, writeFileSync} = require('fs')
const globby = require('globby')
const tools = require('../tools')

module.exports = function(argv) {
  let paths = globby.sync(argv.glob)
  let template = tools.safeModuleEval(readFileSync(argv.template, 'utf8'))

  for (let path of paths) {
    let strings = tools.safeModuleEval(readFileSync(path, 'utf8'))

    if (strings == null) {
      console.log(`${path} skipped`)
      continue
    }

    let updatedStrings = tools.serializeStrings(strings, {
      templateStrings: template
    })

    writeFileSync(path, 'module.exports = ' + updatedStrings)
    console.log(`${path} updated`)
  }
}
