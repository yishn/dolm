exports.load = strings => ({
    strings,
    usedStrings: {},

    t(input, args = {}) {
        let key = typeof input !== 'function'
            ? input
            : input(
                Object.keys(args)
                .reduce((acc, key) => (acc[key] = `\${${key}}`, acc), {})
            )

        let value = strings[key] || input
        this.usedStrings[key] = !strings[key] ? null : value

        return typeof value === 'function' ? value(args) : value
    }
})
