#!/usr/bin/env node

require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('init', 'generate a new project from a template')
  .command('add', 'add a template project')
  .command('remove', 'remove a template project')
  .command('list', 'list available official templates')
  .parse(process.argv)
