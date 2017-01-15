/* eslint consistent-return: 0, no-shadow: 0 */
const fs = require('fs');
const path = require('path');
const skeleton = require('./helpers/skeleton');
const routes = require('./helpers/routes');
const react = require('./helpers/react');
const webpack = require('./helpers/webpack');

const routeExists = (name) => {
  // if skeleton.json ref exists
  if (skeleton.exists(name)) {
    return true;
  }
  // check if route file exist ('./routes/<name>.js')
  if (fs.existsSync(path.join(__dirname, '..', 'routes', `${name}.jsx`))) {
    return true;
  }
  // check if react dir exists ('./src/react/<name>')
  if (fs.existsSync(path.join(__dirname, '..', 'src/react', `${name}`))) {
    return true;
  }
  // check if webpack entry exists
  if (webpack.check(name)) {
    return true;
  }

  return false;
};

module.exports = {

  create: (name) => {
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
    // bail if route does not exist
    if (!routeExists(name)) {
      console.log(`Route '${name}' does not exist.`);
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

};
