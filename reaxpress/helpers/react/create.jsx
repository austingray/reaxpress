import fs from 'fs';
import path from 'path';
import template from './templates/component';
import exists from './exists';

const create = (routes) => {
  // bail if the file already exists.
  if (exists(routes)) {
    return false;
  }

  // create the dir
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/', routes.component);
  try {
    fs.mkdirSync(reactDirPath);
  } catch (err) {
    throw new Error(err);
  }

  // create the file
  const reactFile = path.join(reactDirPath, 'index.jsx');
  try {
    fs.writeFileSync(reactFile, template(routes.component));
  } catch (err) {
    throw new Error(err);
  }

  // success!
  console.log(`...created: ${reactFile}`);
  return true;
};

export default create;
