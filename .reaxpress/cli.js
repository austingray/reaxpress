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
  .description('Delete a route and all its files.')
  .action((route) => {
    if (blacklist.test(route)) {
      return;
    }
    commands.remove(route);
  });

program
  .command('user <action> <username> [password] [role]')
  .description('Manage user accounts.')
  .action((action, username, password, role) => {
    switch (action) {
      case 'create' :
        if (typeof password === 'undefined') {
          console.log('You must provide a password.');
          return;
        }
        commands.user.create(username, password, role, () => {
          process.exit(1);
        });
        break;
      case 'delete':
        console.log('Coming soon...');
        process.exit(1);
        break;
      default :
        console.log('Did not recognize the command.');
        process.exit(1);
        break;
    }
  });

program
  .command('model <name>')
  .description('Generate a boilerplate model methods file and add it to the models registry')
  .action((name) => {
    commands.model(name);
  });

program.parse(process.argv);
process.exit(1);
