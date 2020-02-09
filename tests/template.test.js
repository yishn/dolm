const tap = require('tap')
const dolm = require('./data')
const template = require('../src/template')

tap.test('serializeStrings', async tap => {
  let strings = {
    context1: {
      'Hello World!': 'Hallo Welt!',
      'Good day': 'Guten Tag'
    },
    context2: {
      'Hello World ${name}!': p => `Hallo Welt ${p.name}!`,
      'Good day, ${name}': null
    }
  }

  tap.test('basic serialization', async tap => {
    tap.matchSnapshot(template.serializeStrings(strings))
    tap.matchSnapshot(
      template.serializeStrings(strings, {indent: '\t'}),
      'tab indentation'
    )
  })

  tap.test('correctly indent multiline complex strings', async tap => {
    tap.matchSnapshot(
      template.serializeStrings({
        context1: {
          'Hello World ${name}!': p => {
            return `Hallo Welt ${p.name}!`
          },
          'Hello ${name}, meeting you in this wonderful world has been a pleasure!': p =>
            `Hallo ${p.name}, dich in dieser wunderschönen Welt zu treffen war mir ein Vergnügen!`
        }
      })
    )
  })

  tap.test('correctly mark unused strings', async tap => {
    tap.matchSnapshot(
      template.serializeStrings(
        {
          context1: {
            'Hello World!': 'Hallo Welt!'
          },
          newContext: {
            Bye: 'Tschüss'
          }
        },
        {existingStrings: strings}
      )
    )
  })
})

tap.test('extractStrings', async tap => {
  tap.test('basic extraction', async tap => {
    let codeFunc = () => {
      let t1 = dolm.context('context1')
      let t2 = dolm.context('context2')

      t1('Hello World!')
      t1('Good day')
      t2(p => `Hello World ${p.name}!`, {name: 'Yichuan'})
      t2(p => `Good day, ${p.name}`, {name: 'Yichuan'})
    }

    tap.matchSnapshot(
      template.serializeStrings(template.extractStrings(codeFunc.toString()))
    )
  })

  tap.test('use global t function', async tap => {
    let codeFunc = () => {
      dolm.t('context1', 'Hello World!')
      dolm.t('context2', p => `Hello World ${p.name}!`, {name: 'Yichuan'})
    }

    tap.matchSnapshot(
      template.serializeStrings(template.extractStrings(codeFunc.toString()))
    )
  })

  tap.test('handle scopes correctly', async tap => {
    let codeFunc = () => {
      let t = dolm.context('context1')

      t('Hello World!')

      {
        let t = dolm.context('context2')

        t(p => `Hello World ${p.name}!`, {name: 'Yichuan'})

        function a() {
          t(p => `Good day, ${p.name}`, {name: 'Yichuan'})
        }
      }

      t('Good day')
    }

    tap.matchSnapshot(
      template.serializeStrings(template.extractStrings(codeFunc.toString()))
    )
  })
})
