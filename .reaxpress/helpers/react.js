const fs = require('fs');
const path = require('path');
const template = require('./template');

const react = {};

const deleteFolderRecursive = (_path) => {
  if (fs.existsSync(_path)) {
    fs.readdirSync(_path).forEach((file) => {
      const curPath = `${_path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(_path);
  }
};

react.create = (name) => {
  const nameToUppercase = name.charAt(0).toUpperCase() + name.slice(1);
  const reactDirPath = path.join(__dirname, '../..', 'src/react/', nameToUppercase);
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
  console.log(`...created: ${reactFile}`);
  return true;
};

react.remove = (name) => {
  const nameToUppercase = name.charAt(0).toUpperCase() + name.slice(1);
  const reactDirPath = path.join(__dirname, '../..', 'src/react/', nameToUppercase);
  try {
    deleteFolderRecursive(reactDirPath);
  } catch (err) {
    console.log(`There was an error deleting react dir: ${reactDirPath}`);
    return false;
  }
  console.log(`...removed: ${reactDirPath}`);
  return true;
};

module.exports = react;
