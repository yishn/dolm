const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default
const prettier = require('prettier')
const dolm = require('..')

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

function getContextAssignment(node, dolmIdentifier) {
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
    assignmentNode != null
  ) {
    let id = idNode.name
    let context =
      isObjectMethodCall(assignmentNode, dolmIdentifier, 'context') &&
      assignmentNode.arguments != null &&
      assignmentNode.arguments.length >= 1 &&
      assignmentNode.arguments[0].type === 'StringLiteral'
        ? assignmentNode.arguments[0].value
        : null

    return {id, context}
  }
}

exports.safeEval = function(input, fallback = null) {
  try {
    return Function(`
      "use strict"
      return (${input})
    `)()
  } catch (err) {
    return fallback
  }
}

exports.safeModuleEval = function(input) {
  return Function(`
    "use strict"

    let exports = {}
    let module = {exports}

    ;(() => {${input}})()

    return module.exports
  `)()
}

exports.extractStrings = function(
  code,
  {
    getKey = dolm.getKey,
    dolmIdentifier = 'dolm',
    generateEmptyTemplate = false
  } = {}
) {
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

      let contextAssignment = getContextAssignment(node, dolmIdentifier)

      if (contextAssignment != null) {
        let [translatorFunctions] = translatorFunctionsStack.slice(-1)

        if (contextAssignment.context != null) {
          translatorFunctions[contextAssignment.id] = contextAssignment.context
        } else {
          delete translatorFunctions[contextAssignment.id]
        }
      }

      // Detect t calls

      let context, keyNode, parametersNode

      if (
        isObjectMethodCall(node, dolmIdentifier, 't') &&
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
        let parameters =
          parametersNode == null
            ? []
            : parametersNode.properties
                .filter(
                  node =>
                    node.type === 'ObjectProperty' &&
                    node.key != null &&
                    node.key.type === 'Identifier'
                )
                .map(node => node.key.name)

        let input =
          keyNode.type === 'StringLiteral'
            ? keyNode.value
            : exports.safeEval(code.slice(keyNode.start, keyNode.end))

        if (input != null) {
          let key = getKey(
            input,
            Object.assign({}, ...parameters.map(p => ({[p]: ''})))
          )

          if (strings[context] == null) strings[context] = {}
          strings[context][key] = generateEmptyTemplate ? null : input
        } else {
          // TODO: warn user about incorrect dolm usage
        }
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

exports.serializeStrings = function(
  strings,
  {templateStrings = null, prettierOptions = {}} = {}
) {
  let inner = (obj, path = []) => {
    if (!obj) {
      return 'null'
    } else if (typeof obj === 'function') {
      return obj.toString().replace(/\r/g, '')
    } else if (typeof obj !== 'object') {
      return JSON.stringify(`${obj}`)
    }

    return [
      '{',
      Object.keys(obj)
        .map(key => {
          let value = inner(obj[key], [...path, key])
          let unused =
            templateStrings != null &&
            (path.reduce((acc, key) => acc && acc[key], templateStrings) || {})[
              key
            ] === undefined

          return [
            unused ? '/* unused */ ' : '',
            `${JSON.stringify(key)}: ${value},`
          ].join('')
        })
        .join('\n'),
      '}'
    ].join('\n')
  }

  let merged =
    templateStrings == null
      ? strings
      : exports.mergeStrings([templateStrings, strings])

  return prettier.format(inner(merged), {
    parser: 'json',
    ...prettierOptions
  })
}

exports.mergeStrings = function(stringsArr) {
  let result = {}

  for (let strings of stringsArr) {
    for (let context in strings) {
      result[context] = {
        ...(result[context] || {}),
        ...strings[context]
      }
    }
  }

  return result
}

exports.getStringsInfo = function(strings) {
  let totalStringsCount = 0
  let translatedStringsCount = 0

  for (let context in strings) {
    for (let key in strings[context]) {
      totalStringsCount++

      if (strings[context][key] != null) {
        translatedStringsCount++
      }
    }
  }

  return {
    totalStringsCount,
    translatedStringsCount,
    progress: translatedStringsCount / totalStringsCount
  }
}
