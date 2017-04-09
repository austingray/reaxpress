/* eslint consistent-return: 0, no-shadow: 0 */
import parseRoute from './helpers/parseRoute';
import skeleton from './helpers/skeleton';
import react from './helpers/react';
import routes from './helpers/routes';

module.exports = {
  create: (route, component = '') => {
    // get our { parent, child, component } object
    const parsedRoutes = parseRoute(route, component);
    skeleton.create(parsedRoutes);
    react.create(parsedRoutes);
    routes.create(parsedRoutes);
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
