#!/usr/bin/env node
/* eslint consistent-return: 0, no-shadow: 0 */
import { component, route } from './template';

const program = require('commander');
const fs = require('fs');
const path = require('path');

const webpackConfigFile = path.join(__dirname, '..', 'webpack.config.js');
const appFile = path.join(__dirname, '..', 'app.js');

let cmdValue = '';
let argValue = '';

const mkdirSync = (path) => {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

const commands = {};
commands.route = (arg) => {
  console.log(arg);
  // update app.js
  fs.readFile(appFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    let modified = data.replace(/#route-def/g, `#route-def\nconst ${arg} = require('./routes/${arg}');`);
    modified = modified.replace(/#route-mount/g, `#route-mount\napp.use('/${arg}', ${arg});`);
    fs.writeFile(appFile, modified, 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('successfully added route to app file.');
    });
  });
  // add react components if they do not already exist
  const reactDirPath = path.join(__dirname, '..', 'src/react/', arg);
  const reactFile = path.join(reactDirPath, 'index.jsx');
  mkdirSync(reactDirPath);
  const componentCode = component(arg);
  fs.writeFile(reactFile, componentCode, 'utf8', (err) => {
    if (err) return console.log(err);
    console.log('successfully created react component file.');
  });
  // create route file
  const routeFile = path.join(__dirname, '..', 'routes', `${arg}.jsx`);
  const routeCode = route(arg);
  fs.writeFile(routeFile, routeCode, 'utf8', (err) => {
    if (err) return console.log(err);
    console.log('successfully created route file.');
  });
  // update webpack.config.js
  fs.readFile(webpackConfigFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const modified = data.replace(/entry: {/g, `entry: {\n    ${arg}: './src/react/${arg}',`);
    fs.writeFile(webpackConfigFile, modified, 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('successfully added entry to webpack config file.');
    });
  });
};

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
