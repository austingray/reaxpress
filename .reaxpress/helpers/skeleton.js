// methods for reading/writing our project's skeleton.json
const fs = require('fs');
const path = require('path');

const skeleton = {};

skeleton.file = path.join(__dirname, '..', 'skeleton.json');

skeleton.read = () => {
  const contents = fs.readFileSync(skeleton.file, 'utf8');
  return JSON.parse(contents);
};

skeleton.write = (contents) => {
  fs.writeFileSync(skeleton.file, JSON.stringify(contents));
};

skeleton.exists = (name) => {
  const contents = skeleton.read();
  if (contents.routes.includes(name)) {
    return true;
  }
  return false;
};

skeleton.create = (name) => {
  const contents = skeleton.read();
  contents.routes.push(name);
  skeleton.write(contents);
  console.log(`...created: '${name}' in ${skeleton.file}`);
};

skeleton.remove = (name) => {
  const contents = skeleton.read();
  const index = contents.routes.indexOf(name);
  contents.routes.splice(index, 1);
  skeleton.write(contents);
  console.log(`...removed: '${name}' in ${skeleton.file}`);
};

module.exports = skeleton;
