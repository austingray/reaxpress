import path from 'path';
import fs from 'fs';
import template from './templates/childRoute';

/**
 * The createChild function adds the child route get handler to
 * <project_dir>/routes/<parsedArgs>.jsx file
 * @param  {Object} parsedArgs { parent, child, component }
 * @return {null}
 */
export default (parsedArgs) => {
  // write the route file
  const routeFile = path.join(__dirname, '../../..', 'routes', `${parsedArgs.parent}.jsx`);
  const childRouteCode = template(parsedArgs);

  let routeContent = '';
  try {
    routeContent = fs.readFileSync(routeFile, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
  routeContent = routeContent.replace(/\/\/ end of #reaxpress routes/g, `${childRouteCode}\n// end of #reaxpress routes`);

  try {
    fs.writeFileSync(routeFile, routeContent);
  } catch (err) {
    throw new Error(err);
  }
  console.log(`...created: ${routeFile}`);

  // success!
  return true;
};
