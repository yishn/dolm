exports.load = strings => {
  let usedStrings = {}

  return {
    usedStrings,

    context(context) {
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

        let translated = (strings[context] || {})[key]
        let value = translated || input
        usedStrings[context][key] = !translated ? null : value

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
            let lines = inner(obj[key]).split('\n')
            let slice = Math.min(...lines.map((x, i) =>
              i === 0 ? Infinity : x.match(/^\s*/)[0].length
            ))

            let value = lines
              .map((line, i) => i === 0 ? line : `${indent}${line.slice(slice)}`)
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
