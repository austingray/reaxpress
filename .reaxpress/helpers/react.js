const fs = require('fs');
const path = require('path');
const template = require('./template');

const react = {};

react.create = (name) => {
  const reactDirPath = path.join(__dirname, '../..', 'src/react/', name);
  const reactFile = path.join(reactDirPath, 'index.jsx');
  try {
    fs.mkdirSync(reactDirPath);
  } catch (err) {
    console.log(`There was an error creating directory: '${reactDirPath}'`);
    return false;
  }
  const componentCode = template.component(name);
  try {
    fs.writeFileSync(reactFile, componentCode);
  } catch (err) {
    console.log(`There was an error writing component code to: '${reactFile}'`);
    return false;
  }
  return true;
};

react.remove = (name) => {
  console.log('route.remove() not implemented');
};

module.exports = react;
