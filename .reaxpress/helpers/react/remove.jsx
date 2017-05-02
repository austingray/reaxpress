import fs from 'fs';
import path from 'path';

const componentList = path.join(__dirname, '../../..', 'src/react/Reaxpress/Components.jsx');

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

const remove = (routes) => {
  // delete react component
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/App', routes.component);
  try {
    deleteFolderRecursive(reactDirPath);
  } catch (err) {
    throw new Error(err);
  }

  // delete reference in componentList
  // add to reaxpresscomponentList component
  let componentListContent = '';
  try {
    componentListContent = fs.readFileSync(componentList, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  componentListContent = componentListContent.replace(`\nimport ${routes.component} from './${routes.component}';`, '');
  componentListContent = componentListContent.replace(`\n  ${routes.component},`, '');
  try {
    fs.writeFileSync(componentList, componentListContent);
  } catch (err) {
    throw new Error(err);
  }

  console.log(`...removed: ${reactDirPath}`);
  return true;
};

export default remove;
