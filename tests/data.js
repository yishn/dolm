const dolm = require('..')

let strings = {
  general: {
    'Hello World!': 'Hallo Welt!',
    'I have ${count} apples': p => `Ich habe ${['keine', 'einen'][p.count] || p.count} ${p.count === 1 ? 'A' : 'Ä'}pfel`
  },
  special: {
    'Edit on GitHub': 'Auf GitHub bearbeiten',
    'My name is ${name}': p => `Ich heiße ${p.name}`
  }
}

module.exports = dolm.load(strings)
