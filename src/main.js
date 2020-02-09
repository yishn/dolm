exports.getKey = (input, params = {}) => {
  return typeof input !== 'function'
    ? input.toString()
    : input(
        // Build dummy params object
        Object.keys(params).reduce(
          (acc, key) => ((acc[key] = `\${${key}}`), acc),
          {}
        )
      )
}

exports.load = strings => {
  let instance = {
    strings,

    load(newStrings) {
      instance.strings = strings = newStrings
    },

    t(context, input, params = {}) {
      return instance.context(context)(input, params)
    },

    context(context) {
      return (input, params = {}) => {
        let key = exports.getKey(input, params)
        let value = (strings[context] || {})[key] || input

        return typeof value !== 'function' ? value : value(params)
      }
    }
  }

  return instance
}
