exports.getKey = (input, params = {}) => {
  if (input == null) return null

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

exports.load = (strings, getKey = exports.getKey) => {
  let instance = {
    strings,

    load(newStrings) {
      instance.strings = strings = newStrings
    },

    t(context, input, params = {}) {
      let key = getKey(input, params)
      let value = (strings[context] || {})[key] || input

      return typeof value !== 'function' ? value : value(params)
    },

    context(context) {
      return (input, params = {}) => instance.t(context, input, params)
    }
  }

  return instance
}
