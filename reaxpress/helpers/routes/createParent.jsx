import path from 'path';
import fs from 'fs';
import template from './templates/route';

const mountFile = path.join(__dirname, '../..', 'mount.jsx');

/**
 * The createParent function creates the route file inside <project_dir>/routes/
 * and creates the '/' get handler in that file. It also mounts that path inside
 * of <project_dir>/reaxpress/routes/.
 * @param  {Object} parsedArgs { parent, child, component }
 * @return {null}
 */
export default (parsedArgs) => {
  const name = parsedArgs.parent;

  // write the route file
  const routeFile = path.join(__dirname, '../../..', 'routes', `${name}.jsx`);
  const routeCode = template(parsedArgs);
  try {
    fs.writeFileSync(routeFile, routeCode);
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...created: ${routeFile}`);

  // mount the route by adding it to the mount file
  let routeContent = '';
  try {
    routeContent = fs.readFileSync(mountFile, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  routeContent = routeContent.replace(/#route-def/g, `#route-def\nconst ${name} = require('../routes/${name}');`);
  routeContent = routeContent.replace(/#route-mount/g, `#route-mount\nrouter.use('/${name}', ${name});`);
  try {
    fs.writeFileSync(mountFile, routeContent);
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...mounted: '${name}' in ${mountFile}`);

  // success!
  return true;
};
