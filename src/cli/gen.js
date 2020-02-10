const {readFileSync, writeFileSync} = require('fs')
const globby = require('globby')
const tools = require('../tools')

module.exports = function(argv) {
  let {dolmIdentifier, output} = argv

  let paths = globby.sync(argv.glob, {
    gitignore: true
  })

  let stringsArr = paths.map(path => {
    let content = readFileSync(path, 'utf8')

    return tools.extractStrings(content, {
      dolmIdentifier,
      generateEmptyTemplate: true
    })
  })

  let strings = tools.mergeStrings(stringsArr)
  let serialized = 'module.exports = ' + tools.serializeStrings(strings)

  if (output == null) {
    console.log(serialized)
  } else {
    writeFileSync(output, serialized)
  }
}
