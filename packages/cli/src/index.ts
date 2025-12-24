import { Command } from 'commander'
import { add } from './commands/add.js'
import { init } from './commands/init.js'

const program = new Command()

program.name('joinery').description('Intent-driven design system with semantic layout primitives').version('0.1.0')

program
  .command('init')
  .description('Initialize Joinery in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(init)

program
  .command('add [primitives...]')
  .description('Add specific primitives to your project')
  .option('-a, --all', 'Add all primitives')
  .action(add)

program.parse()
