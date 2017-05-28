/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import parseUrl from 'parseurl';
import Components from './Components';
import defaults from '../../../.reaxpress/helpers/skeleton/defaults';
import custom from '../../../.reaxpress/helpers/skeleton/custom';
import skeletonParse from '../../../.reaxpress/helpers/skeleton/parse';

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

  // loop through all custom and default endpoints
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];

    // loop through all child routes for each endpoint
    for (let j = 0; j < route.routes.length; j += 1) {
      const iteration = route.routes[j];
      const path = skeletonParse(route, iteration);

      // if path === currentPath then we've found a match, return
      if (path === currentPath) {
        /**
         * @callback
         * @type {Boolean} exists whether the route exists or not
         * @type {React.Component} component the component to render
         */
        return callback(true, Components[iteration.component]);
      }
    }
  }

  // if no match was found, return false
  // render the default Page template for the 404 page
  // will need to update this mechanism for regex routes
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

  // get the target href
  const targetHref = event.target.href;

  // parse the target url
  const parsedUrl = parseUrl({ url: targetHref });

  // bail on external links
  if (parsedUrl.hostname !== window.location.hostname) {
    return;
  }

  // assign the target path to be the new url
  const pushUrl = parsedUrl.path;

  // bail on admin pages
  if (pushUrl.indexOf('/admin') === 0) {
    return;
  }

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
