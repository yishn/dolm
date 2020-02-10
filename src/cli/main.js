#!/usr/bin/env node

const yargs = require('yargs')
const gen = require('./gen')

const argv = yargs
  .locale('en')
  .usage('Usage: $0 <command> [args]')
  .command(
    'gen [args] <glob..>',
    'Generate an empty strings template by extracting from source code',
    yargs => {
      return yargs
        .positional('glob', {
          describe: 'Glob pattern for source code files',
          type: 'string'
        })
        .option('dolm-identifier', {
          default: 'dolm',
          describe: 'Specify variable name of dolm',
          type: 'string'
        })
        .option('output', {
          alias: 'o',
          describe: 'Specify output file',
          type: 'string'
        })
    }
  )
  .help().argv

let command = argv._.shift()

if (command === 'gen') {
  gen(argv)
} else {
  yargs.showHelp()
}
