exports.load = strings => {
  let usedStrings = {}

  let instance = {
    strings,
    usedStrings,

    load(newStrings) {
      instance.usedStrings = usedStrings = {}
      instance.strings = strings = newStrings
    },

    t(context, input, params = {}) {
      return instance.context(context)(input, params)
    },

    context(context) {
      return (input, params = {}) => {
        if (!strings[context]) strings[context] = {}
        if (!usedStrings[context]) usedStrings[context] = {}

        let key =
          typeof input !== 'function'
            ? input
            : input(
                // Build dummy params object
                Object.keys(params).reduce(
                  (acc, key) => ((acc[key] = `\${${key}}`), acc),
                  {}
                )
              )

        let value = strings[context][key] || input

        usedStrings[context][key] = value
        strings[context][key] = !strings[context][key] ? null : value

        return typeof value !== 'function' ? value : value(params)
      }
    }
  }

  return instance
}
