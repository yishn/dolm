const dolm = require('..')

let strings = {
  general: {
    'Hello World!': 'Hallo Welt!',
    'apples': p => `${p.count === 1 ? 'Apfel' : 'Äpfel'}`,
    'I have ${count} apples': (p, t) => `Ich habe ${p.count} ${t('apples', p)}`
  },
  special: {
    'Edit on GitHub': 'Auf GitHub bearbeiten',
    'My name is ${name}': p => `Mein Name ist ${p.name}`
  }
}

module.exports = dolm.load(strings)
