import fs from 'fs';
import path from 'path';
import template from './template';

const create = (routes) => {
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/', routes.component);
  const reactFile = path.join(reactDirPath, 'index.jsx');
  try {
    fs.mkdirSync(reactDirPath);
  } catch (err) {
    throw new Error(err);
  }
  try {
    fs.writeFileSync(reactFile, template(routes.component));
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...created: ${reactFile}`);
  return true;
};

export default create;
