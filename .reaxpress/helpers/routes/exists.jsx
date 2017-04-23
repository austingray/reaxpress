import { getRouteFilePath } from './index';

/**
 * Checks the routeFileContents for the existence of the parent and child route
 * @param  {Object} args                    Contains the parsed parent/child/component
 * @param  {String} [_routeFileContents=''] Optionally pass a routeFileConents for testing
 * @return {Object}                         An object with parent/child, values are bool or null
 */
export default (args, _routeFileContents = '') => {
  // type check
  if (typeof args !== 'object' || args === null) {
    console.log(`Invalid arguments in 'cli.routes.create': Args must be an object and not null.`);
    return null
  }

  if (typeof args.parent !== 'string' || typeof args.child !== 'string') {
    console.log(`Invalid arguments in 'cli.routes.create': parent and child Must be string.`);
    console.log(`parent: ${typeof args.parent}`);
    console.log(`child: ${typeof args.child}`);
    return null;
  }

  // bail if parent is empty
  if (args.parent === '') {
    console.log(`Invalid arguments in 'cli.routes.create': Parent was an empty string.`);
    return null;
  }

  // setup return values
  const parentVal = false;
  const childVal = typeof args.child !== 'string' || args.child === ''
    ? null
    : false;
  const returnVals = {
    parent: parentVal,
    child: childVal,
  };

  // check for the existence inside of the route file
  let routeFileContents = _routeFileContents || '';

  // if routeFileContents is empty,
  // check if the file exists, grab the contents if it does
  if (routeFileContents === '') {
    try {

      const routeFilePath = getRouteFilePath(args.parent);

      // bail if the file does not exist
      if (!fs.existsSync(routeFilePath)) {
        return returnVals;
      }

      // get the file contents if the file exists
      routeFileContents = fs.readFileSync(routeFilePath, 'utf8');

    } catch (err) {
      throw new Error(err);
    }
  }

  // check for existence of parent route inside of file
  if (typeof args.parent === 'string' && args.parent !== '') {
    let testString = `router.get('/', async (req, res) => {`;
    if (routeFileContents.indexOf(testString) > -1) {
      returnVals.parent = true;
    }
  }

  // check for the existence of child route inside of file
  if (typeof args.child === 'string' && args.child !== '') {
    let testString = `router.get('${args.child}', async (req, res) => {`;
    if (routeFileContents.indexOf(testString) > -1) {
      returnVals.child = true;
    }
  }

  return returnVals;
};
