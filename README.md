# dolm [![Build Status](https://travis-ci.org/yishn/dolm.svg?branch=master)](https://travis-ci.org/yishn/dolm)

A tiny internationalization library.

## Installation

Use npm to install:

```js
$ npm install dolm
```

## Guide

### Simple Strings

Specify your strings as an object with the default text as the key, and the
translated text as value.

```js
let strings = {
  simple: {
    'Hello World!': 'Hallo Welt!',
    Goodbye: 'Auf Wiedersehen'
  }
}
```

The string object is wrapped around the key `simple`, which is called the
_context_ of the translation. You can specify an arbitrary string as the context
of a strings object. You can also have multiple contexts.

To get the translation function of a context, use:

```js
const dolm = require('dolm').load(strings)

let t = dolm.context('simple')

t('Hello World!')
// => "Hallo Welt!"

// Or equivalently:
dolm.t('simple', 'Hello World')

t('Goodbye')
// => "Auf Wiedersehen"

// Or equivalently:
dolm.t('simple', 'Goodbye')
```

If a key is not found, dolm will fall back to the default text:

```js
t('Good morning') // Key not found
// => "Good morning"
```

### Complex Strings

You can also specify functions inside the translation function. Using so-called
_complex strings_ you can use interpolation and formatting inside translated
text.

```js
const t = dolm.context('complex') // non-existent context

t(p => `My name is ${p.name}`, {name: 'Yichuan'})
// => "My name is Yichuan"

// Or equivalently:
dolm.t('complex', p => `My name is ${p.name}`, {name: 'Yichuan'})

t(p => `I have ${['no apples', 'one apple'][p.count] || `${p.count} apples`}`, {
  count: 1
})
// => "I have one apple"

// Or equivalently:
dolm.t(
  'complex',
  p => `I have ${['no apples', 'one apple'][p.count] || `${p.count} apples`}`,
  {count: 1}
)
```

In the example above, dolm uses the default implementations, because no
translations are provided. To create translations in the strings object, dolm
generates a key from the default implementations.

```js
let strings = {
  simple: {
    'Hello World!': 'Hallo Welt!',
    Goodbye: 'Auf Wiedersehen'
  },
  complex: {
    'My name is ${name}': p => `Ich heiße ${p.name}`,
    'I have ${count} apples': p =>
      `Ich habe ${['keine Äpfel', 'einen Apfel'][p.count] ||
        `${p.count} Äpfel`}`
  }
}
```

If you use complex strings, you have to pay special attention to the key. It's
best to let dolm generate a template strings object with its CLI tool.

It's theoretically possible that two different default implementations generate
the same key, which may cause issues, but in practice, this is rarely a problem.
