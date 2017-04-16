import fs from 'fs';
import path from 'path';

const appIndex = path.join(__dirname, '../../..', 'src/react/reaxpressAppIndex.jsx');

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
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/', routes.component);
  try {
    deleteFolderRecursive(reactDirPath);
  } catch (err) {
    throw new Error(err);
  }

  // delete reference in appIndex
  // add to reaxpressAppIndex component
  let appIndexContent = '';
  try {
    appIndexContent = fs.readFileSync(appIndex, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  appIndexContent = appIndexContent.replace(`\nimport ${routes.component} from './${routes.component}';`, '');
  appIndexContent = appIndexContent.replace(`\n  ${routes.component},`, '');
  try {
    fs.writeFileSync(appIndex, appIndexContent);
  } catch (err) {
    throw new Error(err);
  }

  console.log(`...removed: ${reactDirPath}`);
  return true;
};

export default remove;
