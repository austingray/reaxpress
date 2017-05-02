import fs from 'fs';
import path from 'path';
import template from './templates/component';
import exists from './exists';

const componentList = path.join(__dirname, '../../..', 'src/react/Reaxpress/Components.jsx');

const create = (routes) => {
  // bail if the file already exists.
  if (exists(routes)) {
    return false;
  }

  // create the dir
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/App', routes.component);
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

  // add to reaxpresscomponentList component
  let componentListContent = '';
  try {
    componentListContent = fs.readFileSync(componentList, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  componentListContent = componentListContent.replace(/\/\/ #reaxpress components/g, `// #reaxpress components\nimport ${routes.component} from './${routes.component}';`);
  componentListContent = componentListContent.replace(/\/\/ #reaxpress component list/g, `// #reaxpress component list\n  ${routes.component},`);
  try {
    fs.writeFileSync(componentList, componentListContent);
  } catch (err) {
    throw new Error(err);
  }

  // success!
  console.log(`...created: ${reactFile}`);
  return true;
};

export default create;
