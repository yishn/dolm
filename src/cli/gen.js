const {readFileSync, writeFileSync} = require('fs')
const path = require('path')
const globby = require('globby')
const slash = require('slash')
const mkdirp = require('mkdirp')
const dolm = require('../main')
const tools = require('../tools')

module.exports = function(argv) {
  let paths = globby.sync(argv.glob, {
    gitignore: true
  })

  let getKey =
    argv.getKey == null
      ? dolm.getKey
      : require(slash(path.relative(__dirname, path.resolve(argv.getKey))))

  let stringsArr = paths.map(path => {
    let content = readFileSync(path, 'utf8')
    let time = Date.now()
    if (argv.output != null) process.stdout.write(path)

    let result = tools.extractStrings(content, {
      getKey,
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
    mkdirp.sync(path.dirname(argv.output))
    writeFileSync(argv.output, serialized)
  }
}
