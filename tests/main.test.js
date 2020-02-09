const tap = require('tap')
const dolm = require('./data')

async function test() {
  await Promise.all([
    tap.test('get non-existent context', async tap => {
      let t = dolm.context('non-existent')

      tap.strictEqual(t('Hello World!'), 'Hello World!')
      tap.strictEqual(
        t(p => `Hello ${p.name}`, {name: 'Yichuan'}),
        'Hello Yichuan'
      )
    }),

    tap.test('get non-existent strings in existing context', async tap => {
      let t = dolm.context('special')

      tap.strictEqual(t('Hello World!'), 'Hello World!')
      tap.strictEqual(
        t(p => `Hello ${p.name}`, {name: 'Yichuan'}),
        'Hello Yichuan'
      )
    }),

    tap.test('get existing strings', async tap => {
      let t = dolm.context('general')

      tap.strictEqual(t('Hello World!'), 'Hallo Welt!')

      let complexString = p =>
        `I have ${['no', 'one'][p.count] || p.count} apple${p !== 1 ? 's' : ''}`

      tap.strictEqual(t(complexString, {count: 0}), 'Ich habe keine Äpfel')
      tap.strictEqual(t(complexString, {count: 1}), 'Ich habe einen Apfel')
      tap.strictEqual(t(complexString, {count: 2}), 'Ich habe 2 Äpfel')
    }),

    tap.test('get existing strings directly', async tap => {
      tap.strictEqual(dolm.t('general', 'Hello World!'), 'Hallo Welt!')

      let complexString = p =>
        `I have ${['no', 'one'][p.count] || p.count} apple${p !== 1 ? 's' : ''}`

      tap.strictEqual(
        dolm.t('general', complexString, {count: 0}),
        'Ich habe keine Äpfel'
      )
      tap.strictEqual(
        dolm.t('general', complexString, {count: 1}),
        'Ich habe einen Apfel'
      )
      tap.strictEqual(
        dolm.t('general', complexString, {count: 2}),
        'Ich habe 2 Äpfel'
      )
    })
  ])

  tap.test('serialize', async tap => {
    let serialized = dolm.serialize()

    tap.strictEqual(serialized.translatedCount, 4)
    tap.strictEqual(serialized.untranslatedCount, 4)
    tap.strictEqual(serialized.complete, 0.5)

    tap.matchSnapshot(serialized.js.replace(/\r/g, ''))
  })
}

test()
