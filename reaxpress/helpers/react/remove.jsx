import fs from 'fs';
import path from 'path';

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
  console.log(routes);
  const reactDirPath = path.join(__dirname, '../../..', 'src/react/', routes.component);
  try {
    deleteFolderRecursive(reactDirPath);
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...removed: ${reactDirPath}`);
  return true;
};

export default remove;
