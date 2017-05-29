/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import parseUrl from 'parseurl';
import pathRegexp from 'path-to-regexp';
import Components from './Components';
import defaults from '../../../.reaxpress/helpers/skeleton/defaults';
import custom from '../../../.reaxpress/helpers/skeleton/custom';
import skeletonParse from '../../../.reaxpress/helpers/skeleton/parse';

const routes = [...custom, ...defaults];

/**
 * Route handler for Reaxpress apps
 * Takes an app route and returns the corresponding React Component
 *
 * @param  {String}   [reqPath=null] the current path of the website minus the hostname
 * @param  {Function} callback       callback
 * @callback {Function}              callback: object: React Component
 */
const Router = (reqPath = null, callback) => {
  // set the path to test to be the provided reqPath or the current path
  const testPath = reqPath || window.location.pathname;

  // loop through all custom and default endpoints
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];

    // loop through all child routes for each endpoint
    for (let j = 0; j < route.routes.length; j += 1) {
      const iteration = route.routes[j];
      const path = skeletonParse(route, iteration);

      // if path === testPath then we've found a match, return
      if (pathRegexp(path).exec(testPath)) {
        /**
         * @callback
         * @type {React.Component} component the component to render
         */
        return callback(Components[iteration.component]);
      }
    }
  }

  // if no match was found, return false
  // render the default Page template for the 404 page
  // will need to update this mechanism for regex routes
  return callback(Components.Page);
};

/**
 * Handles the changing of a url
 * It is called when clicking a link or when using the browser buttons
 *
 * If it is an external link or an admin page, it let's it execute as normal
 * If it is an internal link, we want it to be handled by our router.
 */
const handleUrlChange = (e, newAddress, popstate = true) => {
  // parse the newAddress
  const parsedUrl = parseUrl({ url: newAddress });

  // assign the target path to be the new url
  const pushUrl = parsedUrl.path;

  // if the url change is not generated by a popstate event
  if (!popstate) {
    // bail on external links
    if (parsedUrl.hostname !== window.location.hostname) {
      return;
    }

    // bail on admin pages
    if (pushUrl.indexOf('/admin') === 0) {
      return;
    }

    // push the request slug to the browser bar
    window.history.pushState({}, pushUrl, pushUrl);
  }

  if (window.reaxpress.mounted || popstate) {
    window.reaxpress.updateUrl(pushUrl);
    window.reaxpress.reload();
    e.preventDefault();
  }
};

/**
 * This event listener intercepts all clicks on links
 */
document.addEventListener('click', (e) => {
  const event = window.e || e;

  // bail if target is not an A tag
  if (event.target.tagName !== 'A') {
    return;
  }

  // get the target href
  handleUrlChange(event, event.target.href, false);
}, false);

/**
 * Listener for browser back/forward buttons
 */
window.onpopstate = (e) => {
  handleUrlChange(e, document.location.href);
};

export default Router;
