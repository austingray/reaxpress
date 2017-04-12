import fs from 'fs';
import path from 'path';
import template from './templates/component';
import exists from './exists';

const appIndex = path.join(__dirname, '../../..', 'src/react/reaxpressAppIndex.jsx');

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

  // add to reaxpressAppIndex component
  let appIndexContent = '';
  try {
    appIndexContent = fs.readFileSync(appIndex, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  appIndexContent = appIndexContent.replace(/\/\/ #reaxpress components/g, `// #reaxpress components\nimport ${routes.component} from './${routes.component}';`);
  try {
    fs.writeFileSync(appIndex, appIndexContent);
  } catch (err) {
    throw new Error(err);
  }

  // success!
  console.log(`...created: ${reactFile}`);
  return true;
};

export default create;
