const tap = require('tap')
const {context, serialize} = require('./data')

tap.test('get non-existent context', tap => {
    let {t} = context('non-existent')

    tap.equal(t('Hello World!'), 'Hello World!')
    tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    tap.end()
})

tap.test('get non-existent strings in existing context', tap => {
    let {t} = context('special')

    tap.equal(t('Hello World!'), 'Hello World!')
    tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    tap.end()
})

tap.test('get existing strings', tap => {
    let {t} = context('general')

    tap.equal(t('Hello World!'), 'Hallo Welt!')
    tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 0}), 'Ich habe 0 Äpfel')
    tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 1}), 'Ich habe 1 Apfel')
    tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 2}), 'Ich habe 2 Äpfel')
    tap.end()
})
