exports.serialize = strings => {
    return [
        '{',
        Object.keys(strings).sort().map(key => {
            let value = !strings[key] ? 'null'
                : typeof strings[key] === 'function' ? strings[key].toString()
                : JSON.stringify(`${strings[key]}`)

            return `  ${JSON.stringify(key)}: ${value},`
        }).join('\n'),
        '}'
    ].join('\n')
}
