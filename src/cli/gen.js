const {readFileSync, writeFileSync} = require('fs')
const globby = require('globby')
const tools = require('../tools')

module.exports = function(argv) {
  let paths = globby.sync(argv.glob, {
    gitignore: true
  })

  let stringsArr = paths.map(path => {
    let content = readFileSync(path, 'utf8')
    let time = Date.now()
    if (argv.output != null) process.stdout.write(path)

    let result = tools.extractStrings(content, {
      dolmIdentifier: argv.dolmIdentifier,
      generateEmptyTemplate: argv.template
    })

    if (argv.output != null) process.stdout.write(` ${Date.now() - time}ms\n`)
    return result
  })

  let strings = tools.mergeStrings(stringsArr)
  let serialized = 'module.exports = ' + tools.serializeStrings(strings)

  if (argv.output == null) {
    console.log(serialized)
  } else {
    writeFileSync(argv.output, serialized)
  }
}
