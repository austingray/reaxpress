/**
 * Parses the command line input.
 * Splits the parent off and concatenates the remaining as the child.
 * Formats a component name or allows a custom override.
 * @param  {String} route                Formatted as a request path
 * @param  {String} [customComponent=''] Component override.
 * @return {Object}                      { parent, child, component }
 */
const parseRoute = (route, customComponent = '') => {
  // type check
  if (typeof route !== 'string') {
    console.log(`Could not parse route, wanted string, got: typeof ${route}`);
    return null;
  }

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

export default parseRoute;
