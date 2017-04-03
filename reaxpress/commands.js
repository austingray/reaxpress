/* eslint consistent-return: 0, no-shadow: 0 */
const skeleton = require('./helpers/skeleton');
const react = require('./helpers/react');
// const routes = require('./helpers/routes');

const parseRoute = (route, customComponent = '') => {
  const routeNames = route.split('/');
  const parent = routeNames.shift();
  const child = routeNames.length > 0
    ? `/${routeNames.join('/')}`
    : '';
  const component = customComponent === ''
    ? route.split('/').map(string =>
        string.charAt(0).toUpperCase() + string.slice(1),
      ).join('')
    : customComponent;
  return {
    parent,
    child,
    component,
  };
};

module.exports = {
  create: (route, component = '') => {
    const routes = parseRoute(route, component);

    /*
    * Skeleton
    */
    let newSkeleton = [];
    if (!skeleton.exists(routes.parent)) {
      // if the parent route doesn't yet exist,
      // create it. This will return the skeleton.
      // Since createChild executes in the same process
      // we need to pass the new skeleton or the parent won't exist.
      newSkeleton = skeleton.create(routes);
    }
    if (routes.child !== '' && skeleton.existsChild(routes.parent, routes.child) === false) {
      // if the child route does not exist, create it
      skeleton.createChild(routes, newSkeleton);
    }

    // TODO
    /*
    * React
    */
    if (!react.exists(routes)) {
      react.create(routes);
    }

    /*
    * Route
    */

    console.log(`Successfully created route: ${route}`);
  },
  remove: (route) => {
    const routes = parseRoute(route);

    // Skeleton
    const skeletonRemoved = routes.child === '' // eslint-disable-line no-unused-vars
      ? skeleton.remove(routes.parent)
      : skeleton.removeChild(routes.parent, routes.child);

    // TODO
    /*
    * React
    */
    react.remove(routes);

    /*
    * Route
    */

    console.log(`Successfully deleted route: ${route}`);
  },

};
