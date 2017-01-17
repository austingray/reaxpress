require('babel-register');
const program = require('commander');
const commands = require('./commands');

program
  .version('0.0.1');

program
  .command('create <route>')
  .description('Create a route and all its boilerplate files')
  .action((route, options) => {
    const reaxpressData = typeof options.reaxpressData !== 'undefined';
    commands.create(route, reaxpressData);
  });

program
  .command('remove <route>')
  .description('Delete a route and all its files')
  .action((route) => {
    commands.remove(route);
  });

program
  .command('forget <route>')
  .description('Forget a route so it can no longer be controlled by the CLI')
  .action((route) => {
    commands.forget(route);
  });

program.parse(process.argv);
