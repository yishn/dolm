exports.load = strings => ({
    usedStrings: {},

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
        this.usedStrings[key] = !strings[key] ? null : value

        return typeof value !== 'function'
            ? value
            : value(args, this)
    }
})
