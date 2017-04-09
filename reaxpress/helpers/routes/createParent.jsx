import path from 'path';
import template from './templates/route';

export default (name) => {
  const routeFile = path.join(__dirname, '../..', 'routes', `${name}.jsx`);
  const routeCode = template(name);
  try {
    fs.writeFileSync(routeFile, routeCode);
  } catch (err) {
    console.log(`There was an error writing route code to '${routeFile}'`);
    return false;
  }
  console.log(`...created: ${routeFile}`);

  let routeContent = '';
  try {
    routeContent = fs.readFileSync(routeFileJs, 'utf8');
  } catch (err) {
    console.log(`There was a problem reading from ${routeFileJs}`);
    return false;
  }
  routeContent = routeContent.replace(/#route-def/g, `#route-def\nconst ${name} = require('../routes/${name}');`);
  routeContent = routeContent.replace(/#route-mount/g, `#route-mount\nrouter.use('/${name}', ${name});`);
  try {
    fs.writeFileSync(routeFileJs, routeContent);
  } catch (err) {
    console.log(`There was a problem writing to ${routeFileJs}`);
    return false;
  }
  console.log(`...created: '${name}' in ${routeFileJs}`);
  return true;
};
