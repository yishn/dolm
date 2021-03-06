/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tools.test.js TAP extractStrings basic extraction > must match snapshot 1`] = `
{
  "context1": {
    "Hello World!": "Hello World!",
    "Good day": "Good day"
  },
  "context2": {
    "Hello World \${name}!": p => \`Hello World \${p.name}!\`,
    "Good day, \${name}": p => \`Good day, \${p.name}\`
  }
}

`

exports[`tools.test.js TAP extractStrings handle scopes correctly > must match snapshot 1`] = `
{
  "context1": {
    "Hello World!": "Hello World!",
    "Good day": "Good day"
  },
  "context2": {
    "Hello World \${name}!": p => \`Hello World \${p.name}!\`,
    "Good day, \${name}": p => \`Good day, \${p.name}\`
  }
}

`

exports[`tools.test.js TAP extractStrings use global t function > must match snapshot 1`] = `
{
  "context1": {
    "Hello World!": "Hello World!"
  },
  "context2": {
    "Hello World \${name}!": p => \`Hello World \${p.name}!\`
  }
}

`

exports[`tools.test.js TAP mergeStrings > must match snapshot 1`] = `
{
  "context1": {
    "Hello World": "Hallo Welt!",
    "Hello world, \${name}": p => \`Hallo Welt, \${p.name}\`
  },
  "context2": {
    "Goodbye": "Auf Wiedersehen"
  }
}

`

exports[`tools.test.js TAP serializeStrings basic serialization > must match snapshot 1`] = `
{
  "context1": {
    "Hello World!": "Hallo Welt!",
    "Good day": "Guten Tag"
  },
  "context2": {
    "Hello World \${name}!": p => \`Hallo Welt \${p.name}!\`,
    "Good day, \${name}": null
  }
}

`

exports[`tools.test.js TAP serializeStrings correctly indent multiline complex strings > must match snapshot 1`] = `
{
  "context1": {
    "Hello World \${name}!": p => {
      return \`Hallo Welt \${p.name}!\`;
    },
    "Hello \${name}, meeting you in this wonderful world has been a pleasure!": p =>
      \`Hallo \${p.name}, dich in dieser wunderschönen Welt zu treffen war mir ein Vergnügen!\`
  }
}

`

exports[`tools.test.js TAP serializeStrings correctly mark unused strings > must match snapshot 1`] = `
{
  "context1": {
    "Hello World!": "Hallo Welt!",
    "Good day": "Guten Tag"
  },
  "context2": {
    "Hello World \${name}!": p => \`Hallo Welt \${p.name}!\`,
    "Good day, \${name}": null
  },
  /* unused */ "newContext": {
    /* unused */ "Bye": "Tschüss"
  }
}

`
