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
  const currentPath = reqPath || window.location.pathname;
  if (currentPath.indexOf('admin') > -1) {
    return callback(false);
  }
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    for (let j = 0; j < route.routes.length; j += 1) {
      const routeIter = route.routes[j];
      const routePath = routeIter.path === '/'
        ? ''
        : routeIter.path;
      const path = route.key === 'index'
        ? `${routeIter.path}`
        : `/${route.key}${routePath}`;
      if (path === currentPath) {
        return callback(true, Components[routeIter.component]);
      }
    }
  }
  return callback(true, Components.Page);
};

// link handler
document.addEventListener('click', (e) => {
  const event = window.e || e;

  if (event.target.tagName !== 'A') {
    return;
  }

  const currentHost = window.location.host;
  const targetHref = event.target.href;

  // bail on external links
  if (targetHref.indexOf(currentHost) < 0) {
    return;
  }

  // bail on admin pages
  if (targetHref.indexOf('admin') > -1) {
    return;
  }

  const pushUrl = targetHref.split(currentHost)[1];
  window.history.pushState({}, 'Page Title', pushUrl);

  Router(pushUrl, (exists) => {
    if (exists && window.reaxpress.mounted) {
      window.reaxpress.updateUrl(pushUrl);
      window.reaxpress.reload();
      e.preventDefault();
    }
  });
}, false);

export default Router;
