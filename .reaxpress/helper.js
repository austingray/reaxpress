const fs = require('fs');
const path = require('path');

const skeleton = require('./skeleton');
const webpack = require('./webpack');

const helper = {};
helper.routeExists = (name) => {
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

module.exports = helper;
