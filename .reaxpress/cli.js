require('babel-register');
const program = require('commander');
const commands = require('./commands');
const blacklist = require('./helpers/blacklist');

program
  .version('0.4.0');

program
  .command('route [route]>')
  .description('Create a route and all its boilerplate code.')
  .option('-c, --component <component>', 'Specify a custom React component.')
  .option('-d, --delete', 'Delete an existing route.')
  .option('-l, --list', 'List all registered application routes, optionally providing a parent path to check child routes.')
  .action((route, options) => {
    if (options.list) {
      commands.list(route);
      return;
    }
    if (blacklist.test(route)) {
      return;
    }
    const component = typeof options.component === 'undefined'
      ? ''
      : options.component;
    if (options.delete) {
      commands.remove(route);
      return;
    }

    commands.create(route, component);
  });

program
  .command('user <action> <username> [password] [role]')
  .description('Manage user accounts.')
  .action((action, username, password, role) => {
    switch (action) {
      case 'create': {
        const works = false;
        if (works === false) {
          console.log('user methods not available: https://github.com/austingray/reaxpress/issues/8');
          return;
        }
        if (typeof password === 'undefined') {
          console.log('You must provide a password.');
          return;
        }
        commands.user.create(username, password, role, () => {
          process.exit(1);
        });
        break;
      }
      case 'delete': {
        console.log('Coming soon...');
        process.exit(1);
        break;
      }
      default: {
        console.log('Did not recognize the command.');
        process.exit(1);
        break;
      }
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
