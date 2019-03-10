const tap = require('tap')
const dolm = require('./data')

async function test() {
  await Promise.all([
    tap.test('get non-existent context', async tap => {
      let t = dolm.context('non-existent')

      tap.equal(t('Hello World!'), 'Hello World!')
      tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    }),

    tap.test('get non-existent strings in existing context', async tap => {
      let t = dolm.context('special')

      tap.equal(t('Hello World!'), 'Hello World!')
      tap.equal(t(p => `Hello ${p.name}`, {name: 'Yichuan'}), 'Hello Yichuan')
    }),

    tap.test('get existing strings', async tap => {
      let t = dolm.context('general')

      tap.equal(t('Hello World!'), 'Hallo Welt!')

      let complexString = p => `I have ${['no', 'one'][p.count] || p.count} apple${p !== 1 ? 's' : ''}`

      tap.equal(t(complexString, {count: 0}), 'Ich habe keine Äpfel')
      tap.equal(t(complexString, {count: 1}), 'Ich habe einen Apfel')
      tap.equal(t(complexString, {count: 2}), 'Ich habe 2 Äpfel')
    })
  ])

  tap.test('serialize', async tap => {
    let serialized = dolm.serialize()

    tap.equal(serialized.translatedCount, 4)
    tap.equal(serialized.untranslatedCount, 4)
    tap.equal(serialized.progress, .5)

    tap.equal(serialized.js, `
{
  "general": {
    "Hello World!": "Hallo Welt!",
    "I have \${count} apples": p => \`Ich habe \${['keine', 'einen'][p.count] || p.count} \${p.count === 1 ? 'A' : 'Ä'}pfel\`,
  },
  "non-existent": {
    "Hello \${name}": null,
    "Hello World!": null,
  },
  "special": {
    /* unused */ "Edit on GitHub": "Auf GitHub bearbeiten",
    "Hello \${name}": null,
    "Hello World!": null,
    /* unused */ "My name is \${name}": p => \`Ich heiße \${p.name}\`,
  },
}
    `.trim())
  })
}

test()
