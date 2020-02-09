/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`template.test.js TAP serializeStrings basic serialization > must match snapshot 1`] = `
{
  "context1": {
    "Good day": "Guten Tag",
    "Hello World!": "Hallo Welt!",
  },
  "context2": {
    "Good day, \${name}": null,
    "Hello World \${name}!": p => \`Hallo Welt \${p.name}!\`,
  },
}
`

exports[`template.test.js TAP serializeStrings basic serialization > tab indentation 1`] = `
{
	"context1": {
		"Good day": "Guten Tag",
		"Hello World!": "Hallo Welt!",
	},
	"context2": {
		"Good day, \${name}": null,
		"Hello World \${name}!": p => \`Hallo Welt \${p.name}!\`,
	},
}
`

exports[`template.test.js TAP serializeStrings correctly indent multiline complex strings > must match snapshot 1`] = `
{
  "context1": {
    "Hello \${name}, meeting you in this wonderful world has been a pleasure!": p =>
      \`Hallo \${p.name}, dich in dieser wunderschönen Welt zu treffen war mir ein Vergnügen!\`,
    "Hello World \${name}!": p => {
      return \`Hallo Welt \${p.name}!\`
    },
  },
}
`

exports[`template.test.js TAP serializeStrings correctly mark unused strings > must match snapshot 1`] = `
{
  "context1": {
    /* unused */ "Good day": "Guten Tag",
    "Hello World!": "Hallo Welt!",
  },
  /* unused */ "context2": {
    /* unused */ "Good day, \${name}": null,
    /* unused */ "Hello World \${name}!": p => \`Hallo Welt \${p.name}!\`,
  },
  "newContext": {
    "Bye": "Tschüss",
  },
}
`
