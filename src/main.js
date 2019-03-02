exports.load = strings => ({
    t(input, ...args) {
        let key = typeof input === 'function'
            ? input(...[...Array(input.length)].map((_, i) => `\$${i}`))
            : input

        if (!strings[key]) strings[key] = input
        let value = strings[key]

        return typeof value === 'function' ? value(...args) : value
    },

    getStrings() {
        return strings
    }
})
