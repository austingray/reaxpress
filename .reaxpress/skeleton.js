// methods for reading/writing our project's skeleton.json
const fs = require('fs');
const path = require('path');

const skeleton = {};

skeleton.file = path.join(__dirname, 'skeleton.json');

skeleton.read = () => {
  const contents = fs.readFileSync(skeleton.file, 'utf8');
  return JSON.parse(contents);
};

skeleton.exists = (name) => {
  const contents = skeleton.read();
  if (contents.routes.includes(name)) {
    return true;
  }
  return false;
};

module.exports = skeleton;
