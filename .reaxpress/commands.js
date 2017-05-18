/* eslint consistent-return: 0, no-shadow: 0 */
import parseRoute from './helpers/parseRoute';
import skeleton from './helpers/skeleton';
import react from './helpers/react';
import routes from './helpers/routes';
import models from './helpers/models';
import Models from '../models';

module.exports = {
  list: (route = '') => {
    if (route !== '') {
      console.log('specific route testing coming soon.');
    }
    const routes = [...skeleton.defaults, ...skeleton.custom];
    const results = [];
    let total = 0;
    routes.forEach((parent) => {
      // don't prepend parent slug if it's the index route
      const parentSlug = parent.key === 'index'
        ? ''
        : `/${parent.key}`;
      parent.routes.forEach((child) => {
        const childSlug = child.path === '/'
          ? ''
          : child.path;

        const result = `${parentSlug}${childSlug}`;
        if (result.length > 0) {
          results.push(result);
          total += 1;
        }
      });
    });

    // hardcode the default index route
    console.log('/');
    total += 1;
    // do all routes
    results.forEach(result => console.log(result));
    console.log('----------------------');
    console.log(`Total: ${total} routes`);
  },
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
  user: {
    async create(username, password, role, callback) {
      try {
        new Models.Users().create(username, password, role).then((user) => {
          console.log('Successfully created user:');
          console.log(user);
          callback();
        });
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  model: (name) => {
    models.create(name);
  },
};
