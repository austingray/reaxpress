const fs = require('fs');
const path = require('path');

const skeleton = require('./skeleton');
const webpack = require('./webpack');

const helper = {};
helper.routeExists = (name) => {
  // if skeleton.json ref exists
  if (skeleton.exists(name)) {
    console.log(`'${name}' is already a registered route`);
    return true;
  }
  // check if route file exist ('./routes/<name>.js')
  if (fs.existsSync(path.join(__dirname, '..', 'routes', `${name}.jsx`))) {
    console.log(`'${name}' already exists outside your registered routes. See ./routes/${name}.jsx`);
    return true;
  }
  // check if react dir exists ('./src/react/<name>')
  if (fs.existsSync(path.join(__dirname, '..', 'src/react', `${name}`))) {
    console.log(`'${name}' already exists outside your registered routes. See ./src/react/${name}`);
    return true;
  }
  // check if webpack entry exists
  if (webpack.check(name)) {
    console.log(`'${name}' already exists in your webpack config`);
    return true;
  }

  return false;
};

module.exports = helper;
