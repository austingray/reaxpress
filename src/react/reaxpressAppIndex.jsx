/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import defaults from '../../reaxpress/helpers/skeleton/defaults';
import custom from '../../reaxpress/helpers/skeleton/custom';
import Account from './Account';
import Admin from './Admin';
import Index from './Index';
import Login from './Login';
import Register from './Register';
// #reaxpress components

const componentList = { Account, Admin, Index, Login, Register, // eslint-disable-line
  // #reaxpress component list
};

const routes = [...custom, ...defaults];

if (typeof window !== 'undefined') {
  const currentPath = window.location.pathname;
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    for (let j = 0; j < route.routes.length; j += 1) {
      const routePath = route.routes[j];
      const path = route.key === 'index'
        ? `${routePath.path}`
        : `/${route.key}${routePath.path}`;
      if (path === currentPath) {
        const RenderComponent = componentList[routePath.component];
        ReactDOM.render(
          <RenderComponent />,
          document.getElementById('app'),
        );
      }
    }
  }
}
