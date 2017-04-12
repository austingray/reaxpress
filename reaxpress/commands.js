/* eslint consistent-return: 0, no-shadow: 0 */
import parseRoute from './helpers/parseRoute';
import skeleton from './helpers/skeleton';
import react from './helpers/react';
import routes from './helpers/routes';

module.exports = {
  create: (route, component = '') => {
    const parsedRoutes = parseRoute(route, component);
    skeleton.create(parsedRoutes);
    react.create(parsedRoutes);
    routes.create(parsedRoutes);
    console.log(`Successfully created route: ${route}`);
  },
  remove: (route) => {
    const parsedRoutes = parseRoute(route);
    if (parsedRoutes.child === '') {
      skeleton.remove(parsedRoutes.parent);
      react.remove(parsedRoutes);
      routes.removeParent(parsedRoutes);
    } else {
      skeleton.removeChild(parsedRoutes.parent, parsedRoutes.child);
      react.remove(parsedRoutes);
      routes.removeChild(parsedRoutes);
    }
    console.log(`Successfully deleted route: ${route}`);
  },

};
