/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import Components from './Components';
import defaults from '../../../.reaxpress/helpers/skeleton/defaults';
import custom from '../../../.reaxpress/helpers/skeleton/custom';

const routes = [...custom, ...defaults];

/**
 * Route handler for Reaxpress apps
 * @param  {String}   [reqPath=null] the current path of the website minus the hostname
 * @param  {Function} callback       callback
 * @callback {Function}              callback: boolean: exists, object: React Component
 */
const Router = (reqPath = null, callback) => {
  // set the path to test to be the provided reqPath or the current path
  const currentPath = reqPath || window.location.pathname;

  // always serve admin pages fresh
  if (currentPath.indexOf('admin') > -1) {
    return callback(false);
  }

  // loop through all custom and default endpoints
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];

    // loop through all child routes for each endpoint
    for (let j = 0; j < route.routes.length; j += 1) {
      // set the route to test
      const routeIter = route.routes[j];

      // if routeIter.path === '/' then it is the top level route, disregard
      const routePath = routeIter.path === '/'
        ? ''
        : routeIter.path;

      // if route.key === 'index', then it is the homepage
      // that is the only route where the key should not be prepended
      const path = route.key === 'index'
        ? `${routeIter.path}`
        : `/${route.key}${routePath}`;

      // if path === currentPath then we've found a match, return
      if (path === currentPath) {
        /**
         * @callback
         * @type {Boolean} exists whether the route exists or not
         * @type {React.Component} component the component to render
         */
        return callback(true, Components[routeIter.component]);
      }
    }
  }
  // if no match was found, return false
  // render the default Page template for the 404 page
  return callback(false, Components.Page);
};

/**
 * This event listener intercepts all clicks on links
 * it compares the current hostname to the target hostname
 * If it is an external link or an admin page, it let's it execute as normal
 * If it is an internal link, we want it to be handled by our router.
 * @type {[type]}
 */
document.addEventListener('click', (e) => {
  const event = window.e || e;

  // bail if target is not an A tag
  if (event.target.tagName !== 'A') {
    return;
  }

  // get the current host
  const currentHost = window.location.host;
  // get the target href
  const targetHref = event.target.href;

  // bail on external links
  if (targetHref.indexOf(currentHost) < 0) {
    return;
  }

  // bail on admin pages
  if (targetHref.indexOf('admin') > -1) {
    return;
  }

  // grab the slug of the request url
  const pushUrl = targetHref.split(currentHost)[1];

  // push the request slug to the browser bar
  window.history.pushState({}, 'Page Title', pushUrl);

  // pass the slug to the Router
  Router(pushUrl, (exists) => {
    if (exists && window.reaxpress.mounted) {
      window.reaxpress.updateUrl(pushUrl);
      window.reaxpress.reload();
      e.preventDefault();
    }
  });
}, false);

export default Router;
