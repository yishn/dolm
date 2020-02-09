const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default

function safeEval(input) {
  return Function(`"use strict"; return (${input});`)()
}

function isObjectMethodCall(node, objName, methodName) {
  return (
    node.type === 'CallExpression' &&
    node.callee != null &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object != null &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === objName &&
    node.callee.property != null &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === methodName
  )
}

function isFunctionCall(node, functionName) {
  return (
    node.type === 'CallExpression' &&
    node.callee != null &&
    node.callee.type === 'Identifier' &&
    node.callee.name === functionName
  )
}

function getContextAssignment(node) {
  let [idNode, assignmentNode] =
    node.type === 'VariableDeclarator' && node.id != null && node.init != null
      ? [node.id, node.init]
      : node.type === 'AssignmentExpression' &&
        node.operator === '=' &&
        node.left != null &&
        node.right != null
      ? [node.left, node.right]
      : []

  if (
    idNode != null &&
    idNode.type === 'Identifier' &&
    assignmentNode != null &&
    isObjectMethodCall(assignmentNode, 'dolm', 'context') &&
    assignmentNode.arguments != null &&
    assignmentNode.arguments.length >= 1 &&
    assignmentNode.arguments[0].type === 'StringLiteral'
  ) {
    let id = idNode.name
    let context = assignmentNode.arguments[0].value

    return {id, context}
  }
}

exports.extractStrings = function(code) {
  let strings = {}
  let translatorFunctionsStack = [{}]

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

      // Manage stack

      if (node.type === 'BlockStatement') {
        translatorFunctionsStack.push({})
      }

      // Detect context calls

      let contextAssignment = getContextAssignment(node)

      if (contextAssignment != null) {
        let [translatorFunctions] = translatorFunctionsStack.slice(-1)
        translatorFunctions[contextAssignment.id] = contextAssignment.context
      }

      // Detect t calls

      let context, keyNode, parametersNode

      if (
        isObjectMethodCall(node, 'dolm', 't') &&
        node.arguments.length >= 2 &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        context = node.arguments[0].value
        keyNode = node.arguments[1]
        parametersNode = node.arguments[2]
      } else {
        // Detect local calls

        let translatorFunctions = Object.assign({}, ...translatorFunctionsStack)

        let id = Object.keys(translatorFunctions).find(id =>
          isFunctionCall(node, id)
        )

        if (id != null) {
          context = translatorFunctions[id]
          keyNode = node.arguments[0]
          parametersNode = node.arguments[1]
        }
      }

      if (
        context != null &&
        keyNode != null &&
        (parametersNode == null || parametersNode.type === 'ObjectExpression')
      ) {
        let key =
          keyNode.type === 'StringLiteral'
            ? keyNode.value
            : safeEval(code.slice(keyNode.start, keyNode.end))
        let parameters =
          parametersNode == null
            ? []
            : Object.keys(
                safeEval(code.slice(parametersNode.start, parametersNode.end))
              )

        if (typeof key === 'function')
          key = key(
            Object.assign({}, ...parameters.map(p => ({[p]: `\${${p}}`})))
          ).toString()

        if (strings[context] == null) strings[context] = {}
        strings[context][key] = null
      }
    },

    exit(path) {
      let node = path.node

      // Manage stack

      if (node.type === 'BlockStatement') {
        translatorFunctionsStack.pop()
      }
    }
  })

  return strings
}

console.log(
  exports.extractStrings(`
    const t = dolm.context('complex') // non-existent context

    t(p => \`My name is \${p.name}\`, {name: 'Yichuan'})
    // => "My name is Yichuan"

    // Or equivalently:
    dolm.t('complex2', p => \`My name is \${p.name}\`, {name: 'Yichuan'})

    {
      let t = dolm.context('hi')

      t(p => \`I have \${['no apples', 'one apple'][p.count] || \`\${p.count} apples\`}\`, {
        count: 1
      })
      // => "I have one apple"
    }

    t('test')

    // Or equivalently:
    dolm.t(
      'complex2',
      p => \`I have \${['no apples', 'one apple'][p.count] || \`\${p.count} apples\`}\`,
      {count: 1}
    )
  `)
)
