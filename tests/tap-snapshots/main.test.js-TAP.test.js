/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`main.test.js TAP serialize > must match snapshot 1`] = `
{
  "general": {
      "Hello World!": "Hallo Welt!",
      "I have \${count} apples": p =>
        \`Ich habe \${['keine', 'einen'][p.count] || p.count} \${
          p.count === 1 ? 'A' : 'Ä'
        }pfel\`,
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
`
