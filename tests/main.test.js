const tap = require('tap')
const {context, serialize} = require('./data')

async function test() {
  await Promise.all([
    tap.test('get non-existent context', async tap => {
      let {t} = context('non-existent')

      tap.equal(t('Hello World!'), 'Hello World!')
      tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    }),

    tap.test('get non-existent strings in existing context', async tap => {
      let {t} = context('special')

      tap.equal(t('Hello World!'), 'Hello World!')
      tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    }),

    tap.test('get existing strings', async tap => {
      let {t} = context('general')

      tap.equal(t('Hello World!'), 'Hallo Welt!')
      tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 0}), 'Ich habe 0 Äpfel')
      tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 1}), 'Ich habe 1 Apfel')
      tap.equal(t((p, t) => `I have ${p.count} ${t('apples', p)}`, {count: 2}), 'Ich habe 2 Äpfel')
    })
  ])

  tap.test('serialize', async tap => {
    let usedStrings = serialize()

    tap.equal(usedStrings, `
{
  "general": {
    "Hello World!": "Hallo Welt!",
    "I have \${count} apples": (p, t) => \`Ich habe \${p.count} \${t('apples', p)}\`,
    "apples": p => \`\${p.count === 1 ? 'Apfel' : 'Äpfel'}\`,
  },
  "non-existent": {
    "Hello \${name}": null,
    "Hello World!": null,
  },
  "special": {
    "Hello \${name}": null,
    "Hello World!": null,
  },
}
    `.trim())
  })
}

test()
