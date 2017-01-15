// methods for reading/writing to our webpack config file

const webpack = {};

webpack.file = require('../webpack.config.js');

webpack.check = (name) => {
  if (typeof webpack.file.entry[name] === 'undefined') {
    return false;
  }
  return true;
};

module.exports = webpack;
