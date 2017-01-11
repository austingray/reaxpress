#!/usr/bin/env node
const program = require('commander');

const commands = {};
commands.route = function(arg) {
  console.log('command:', cmdValue);
  console.log('argument:', argValue);
}

program
  .version('0.0.1')
  .action(function(cmd, arg) {
    cmdValue = cmd;
    argValue = arg
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
