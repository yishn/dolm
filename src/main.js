exports.load = strings => ({
    t(input, ...args) {
        let key = typeof input === 'function'
            ? input(...[...Array(input.length)].map((_, i) => `\$${i}`))
            : input

        if (!strings[key]) strings[key] = input
        let value = strings[key]

        return typeof value === 'function' ? value(...args) : value
    },

    serialize() {
        return [
            '{',
            Object.keys(strings).map(key => {
                let value = !strings[key] ? null
                    : typeof strings[key] === 'function' ? strings[key].toString()
                    : JSON.stringify(`${strings[key]}`)

                return value == null ? null : `  ${JSON.stringify(key)}: ${value}`
            }).filter(x => x != null).join(',\n'),
            '}'
        ].join('\n')
    }
})
