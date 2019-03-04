exports.load = strings => {
  let usedStrings = {}

  return {
    usedStrings,

    context(context) {
      usedStrings[context] = {}

      return {
        context,
        usedStrings,

        t(input, args = {}) {
          let key = typeof input !== 'function'
            ? input
            : input(
              // Build dummy args object
              Object.keys(args).reduce((acc, key) => (
                acc[key] = `\${${key}}`,
                acc
              ), {}),
              this
            )

          let value = strings[key] || input
          usedStrings[context][key] = !strings[key] ? null : value

          return typeof value !== 'function'
            ? value
            : value(args, this)
        }
      }
    },

    serialize(indent = '  ') {
      let inner = obj => {
        if (!obj)
          return 'null'
        else if (typeof obj === 'function')
          return obj.toString()
        else if (typeof obj !== 'object')
          return JSON.stringify(`${obj}`)

        return [
          '{',
          Object.keys(obj).sort().map(key => {
            let value = inner(obj[key])
              .split('\n')
              .map((line, i) => i === 0 ? line : `${indent}${line}`)
              .join('\n')

            return `${indent}${JSON.stringify(key)}: ${value},`
          }).join('\n'),
          '}'
        ].join('\n')
      }

      return inner(usedStrings)
    }
  }
}
