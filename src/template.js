const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default

function safeEval(input) {
  return Function(`"use strict"; return (${input});`)()
}

exports.extractStrings = function(code) {
  let strings = {}
  let globalContext = null
  let ast = parse(code, {
    allowImportExportEverywhere: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    errorRecovery: true,
    sourceType: 'unambiguous'
  })

  traverse(ast, {
    enter(path) {
      let node = path.node

      // Detect context calls

      if (
        node.type === 'CallExpression' &&
        node.callee != null &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object != null &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'dolm' &&
        node.callee.property != null &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'context' &&
        node.arguments != null &&
        node.arguments.length >= 1 &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        globalContext = node.arguments[0].value
      }

      // Detect t calls

      if (
        node.type === 'CallExpression' &&
        node.callee != null &&
        ((node.callee.type === 'Identifier' && node.callee.name === 't') ||
          (node.callee.type === 'MemberExpression' &&
            node.callee.object != null &&
            node.callee.object.type === 'Identifier' &&
            node.callee.object.name === 'dolm' &&
            node.callee.property != null &&
            node.callee.property.type === 'Identifier' &&
            node.callee.property.name === 't'))
      ) {
        let hasContext =
          node.arguments.length >= 1 &&
          node.arguments[0].type === 'StringLiteral' &&
          (node.arguments.length >= 3 ||
            (node.arguments.length === 2 &&
              node.arguments[1].type !== 'ObjectExpression'))

        let context = hasContext ? node.arguments[0].value : globalContext
        if (strings[context] == null) strings[context] = {}

        let parametersNode = hasContext ? node.arguments[2] : node.arguments[1]
        if (
          parametersNode != null &&
          parametersNode.type !== 'ObjectExpression'
        )
          parametersNode = null

        let parameters =
          parametersNode == null
            ? []
            : Object.keys(
                safeEval(code.slice(parametersNode.start, parametersNode.end))
              )

        let keyNode = node.arguments[hasContext ? 1 : 0]
        let key =
          keyNode.type === 'StringLiteral'
            ? keyNode.value
            : safeEval(code.slice(keyNode.start, keyNode.end))

        if (typeof key === 'function')
          key = key(
            Object.assign({}, ...parameters.map(p => ({[p]: `\${${p}}`})))
          ).toString()

        strings[context][key] = null
      }
    }
  })

  return strings
}
