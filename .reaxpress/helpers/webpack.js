const fs = require('fs');
const path = require('path');

const webpackConfigFile = path.join(__dirname, '../..', 'webpack.config.js');
const webpack = {};

webpack.file = require('../../webpack.config.js');

webpack.check = (name) => {
  if (typeof webpack.file.entry[name] === 'undefined') {
    return false;
  }
  return true;
};

webpack.read = () => {
  let webpackCode = '';
  try {
    webpackCode = fs.readFileSync(webpackConfigFile, 'utf8');
  } catch (err) {
    console.log(`There was a problem reading from webpack config file: ${webpackConfigFile}`);
    return false;
  }
  return webpackCode;
};

webpack.write = (content) => {
  try {
    fs.writeFileSync(webpackConfigFile, content);
  } catch (err) {
    console.log(`There was an error writing to webpack config file: ${webpackConfigFile}`);
    return false;
  }
  return true;
};

webpack.create = (name) => {
  if (webpack.check(name)) {
    console.log('Entry already existed in webpack config');
    return false;
  }
  let webpackCode = webpack.read();
  webpackCode = webpackCode.replace(/entry: {/g, `entry: {\n    ${name}: './src/react/${name}',`);
  return webpack.write(webpackCode);
};

webpack.remove = (name) => {
  if (!webpack.check(name)) {
    console.log('Entry does not exist in webpack config');
    return false;
  }
  let webpackCode = webpack.read();
  webpackCode = webpackCode.replace(`\n    ${name}: './src/react/${name}',`, '');
  return webpack.write(webpackCode);
};

module.exports = webpack;
