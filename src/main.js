exports.load = strings => {
  let usedStrings = {}

  return {
    usedStrings,

    context(context) {
      if (!strings[context]) strings[context] = {}
      if (!usedStrings[context]) usedStrings[context] = {}

      let t = (input, params = {}) => {
        let key = typeof input !== 'function'
          ? input
          : input(
            // Build dummy params object
            Object.keys(params).reduce((acc, key) => (
              acc[key] = `\${${key}}`,
              acc
            ), {})
          )

        let value = strings[context][key] || input
        usedStrings[context][key] = !strings[context][key] ? null : value

        return typeof value !== 'function'
          ? value
          : value(params)
      }

      return t
    },

    serialize(indent = '  ') {
      let translatedCount = 0
      let untranslatedCount = 0

      let inner = obj => {
        if (!obj) {
          untranslatedCount++
          return 'null'
        } else if (typeof obj === 'function') {
          translatedCount++
          return obj.toString()
        } else if (typeof obj !== 'object') {
          translatedCount++
          return JSON.stringify(`${obj}`)
        }

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

      let js = inner(usedStrings)
      let progress = untranslatedCount + translatedCount === 0 ? 0
        : translatedCount / (untranslatedCount + translatedCount)

      return {
        translatedCount,
        untranslatedCount,
        progress,
        js
      }
    }
  }
}
