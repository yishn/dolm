#!/usr/bin/env node

const yargs = require('yargs')
const gen = require('./gen')
const update = require('./update')

const argv = yargs
  .locale('en')
  .usage('Usage: $0 <command> [args]')
  .command(
    'gen [args] <glob..>',
    'Generates a strings file by extracting strings from source code',
    yargs => {
      return yargs
        .positional('glob', {
          describe: 'Glob pattern for source code files',
          type: 'string'
        })
        .option('get-key', {
          default: null,
          describe: 'Specify a getKey function',
          type: 'string'
        })
        .option('dolm-identifier', {
          default: 'dolm',
          describe: 'Specify variable name of dolm',
          type: 'string'
        })
        .option('template', {
          default: false,
          alias: 't',
          describe: 'Generate an empty template file',
          type: 'boolean'
        })
        .option('output', {
          alias: 'o',
          describe: 'Specify output file path',
          type: 'string'
        })
    }
  )
  .command(
    'update <template> <glob..>',
    'Updates existing strings files by marking unused strings and appending new strings from the strings template file',
    yargs => {
      return yargs
        .positional('template', {
          describe: 'Path of the strings template file',
          type: 'string'
        })
        .positional('glob', {
          describe: 'Glob pattern for existing strings files',
          type: 'string'
        })
    }
  )
  .help().argv

let command = argv._.shift()

if (command === 'gen') {
  gen(argv)
} else if (command === 'update') {
  update(argv)
} else {
  yargs.showHelp()
}
