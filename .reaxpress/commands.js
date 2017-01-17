/* eslint consistent-return: 0, no-shadow: 0 */
const fs = require('fs');
const path = require('path');
const skeleton = require('./helpers/skeleton');
const routes = require('./helpers/routes');
const react = require('./helpers/react');
const webpack = require('./helpers/webpack');

const routeExists = (name) => {
  let exists = false;
  // if skeleton.json ref exists
  if (skeleton.exists(name)) {
    console.log(`'${name}' exists in skeleton.json`);
    exists = true;
  }
  // check if route file exist ('./routes/<name>.js')
  if (fs.existsSync(path.join(__dirname, '..', 'routes', `${name}.jsx`))) {
    console.log(`'${name}' exists as project route file`);
    exists = true;
  }
  // check if react dir exists ('./src/react/<name>')
  if (fs.existsSync(path.join(__dirname, '..', 'src/react', `${name}`))) {
    console.log(`'${name}' exists as react component`);
    exists = true;
  }
  // check if webpack entry exists
  if (webpack.check(name)) {
    console.log(`'${name}' exists in webpack config`);
    exists = true;
  }

  return exists;
};

// these route names cannot be used by the CLI
const blacklisted = [
  'index',
];

module.exports = {

  create: (name) => {
    if (blacklisted.includes(name)) {
      console.log(`Route '${name}' is a protected route`);
      return false;
    }

    // bail if route exists
    if (routeExists(name)) {
      return false;
    }

    skeleton.create(name);
    react.create(name);
    routes.create(name);
    webpack.create(name);

    console.log(`Successfully created route: ${name}`);
  },

  remove: (name) => {
    if (blacklisted.includes(name)) {
      console.log(`Route '${name}' is a protected route`);
      return false;
    }

    // bail if route is not registered in skeleton file
    if (!skeleton.exists(name)) {
      console.log(`Route '${name}' does not exist or is not registered in skeleton.json`);
      return false;
    }

    // protected routes cannot be deleted
    if (['index'].includes(name)) {
      console.log(`Route '${name}' is a protected route`);
      return false;
    }

    skeleton.remove(name);
    react.remove(name);
    routes.remove(name);
    webpack.remove(name);
  },

  forget: (name) => {
    if (blacklisted.includes(name)) {
      console.log(`Route '${name}' is a protected route`);
      return false;
    }

    // bail if route does not exist
    if (!routeExists(name)) {
      console.log(`Route '${name}' does not exist.`);
      return false;
    }

    skeleton.remove(name);
  },

};
