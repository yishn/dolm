exports.serialize = obj => {
    if (!obj)
        return 'null'
    else if (typeof obj === 'function')
        return obj.toString()
    else if (typeof obj !== 'object')
        return JSON.stringify(`${obj}`)

    return [
        '{',
        Object.keys(obj).sort().map(key => {
            let value = exports.serialize(obj[key])
                .split('\n')
                .map((line, i) => i === 0 ? line : `  ${line}`)
                .join('\n')

            return `  ${JSON.stringify(key)}: ${value},`
        }).join('\n'),
        '}'
    ].join('\n')
}
