import path from 'path';
import fs from 'fs';

const mountFile = path.join(__dirname, '../..', 'mount.jsx');

export default (parsedArgs) => {
  const name = parsedArgs.parent;
  // remove route file
  const routeFile = path.join(__dirname, '../../..', 'routes', `${name}.jsx`);
  fs.unlinkSync(routeFile);
  console.log(`...removed: ${routeFile}`);

  // remove mount
  let routeContent = '';
  try {
    routeContent = fs.readFileSync(mountFile, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  routeContent = routeContent.replace(`\nconst ${name} = require('../routes/${name}');`, '');
  routeContent = routeContent.replace(`\nrouter.use('/${name}', ${name});`, '');
  try {
    fs.writeFileSync(mountFile, routeContent);
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...removed: '${name} in ${mountFile}'`);
  return true;
};
