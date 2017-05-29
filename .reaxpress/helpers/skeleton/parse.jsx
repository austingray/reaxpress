/*
 * Used to parse a single route when iterating through skeleton routes
 * for example:
 *
 *   for (let i = 0; i < skeletonRoutes.length; i += 1) {
 *     const route = skeletonRoutes[i];
 *     for (let j = 0; j < route.routes.length; j += 1) {
 *       const iteration = route.routes[j];
 *       // skeletonParse is this exported function
 *       const path = skeletonParse(route, iteration);
 *     }
 *   }
 *
 */
export default (parent, child) => {
  // set the route to test
  const routeIter = child;

  // if routeIter.path === '/' then it is the top level route, disregard
  const routePath = routeIter.path === '/'
    ? ''
    : routeIter.path;

  // if route.key === 'index', then it is the homepage
  // that is the only route where the key should not be prepended
  const path = parent.key === 'index'
    ? `${routeIter.path}`
    : `/${parent.key}${routePath}`;

  return path;
};
