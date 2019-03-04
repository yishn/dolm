exports.load = strings => {
  let usedStrings = {}

  return {
    usedStrings,

    context(context) {
      if (!strings[context]) strings[context] = {}
      if (!usedStrings[context]) usedStrings[context] = {}

      let self = {
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
              exports.load({}).context('').t
            )

          let value = strings[context][key] || input
          usedStrings[context][key] = !strings[context][key] ? null : value

          return typeof value !== 'function'
            ? value
            : value(args, self.t)
        }
      }

      return self
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
