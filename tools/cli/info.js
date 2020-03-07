const {readFileSync} = require('fs')
const tools = require('..')

module.exports = function(argv) {
  let js = readFileSync(argv.path, 'utf8')
  let strings = tools.safeModuleEval(js)
  let info = tools.getStringsInfo(strings)
  let unusedFlags = js.split('/* unused */').length - 1

  console.log(
    JSON.stringify(
      {
        ...info,
        unusedFlags
      },
      null,
      '  '
    )
  )
}
