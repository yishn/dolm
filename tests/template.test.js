const tap = require('tap')
const dolm = require('./data')
const template = require('../src/template')

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

tap.test('serializeStrings', async tap => {
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
