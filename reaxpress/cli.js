require('babel-register');
const program = require('commander');
const commands = require('./commands');
const blacklist = require('./helpers/blacklist');

program
  .version('0.4.0');

program
  .command('create <route>')
  .description('Create a route and all its boilerplate code.')
  .option('-c, --component <component>', 'Specify a component instead of a Reaxpress generated component.')
  .action((route, options) => {
    if (blacklist.test(route)) {
      return;
    }
    const component = typeof options.component === 'undefined'
      ? ''
      : options.component;
    commands.create(route, component);
  });

program
  .command('remove <route>')
  .description('Delete a route and all its files')
  .action((route) => {
    if (blacklist.test(route)) {
      return;
    }
    commands.remove(route);
  });

program.parse(process.argv);
