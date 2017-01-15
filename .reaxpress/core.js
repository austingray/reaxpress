require('babel-register');
const program = require('commander');
const commands = require('./commands');

let cmdValue = '';
let argValue = '';

program
  .version('0.0.1')
  .action((cmd, arg) => {
    cmdValue = cmd;
    argValue = arg;
  });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
  console.error('no command given!');
  process.exit(1);
}

if (typeof commands[cmdValue] === 'undefined') {
  console.error(`'${cmdValue}' is not a valid command.`);
  process.exit(1);
}

commands[cmdValue](argValue);
