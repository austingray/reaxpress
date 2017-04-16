/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import defaults from '../../reaxpress/helpers/skeleton/defaults';
import custom from '../../reaxpress/helpers/skeleton/custom';
import Account from './Account';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import Page from './_global/Page';
// #reaxpress components

const componentList = { Index, Login, Register, Account, Page, // eslint-disable-line
  // #reaxpress component list
};

const routes = [...custom, ...defaults];

const checkRegisteredRoutes = (reqPath = null, callback) => {
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
        return callback(true, componentList[routeIter.component]);
      }
    }
  }
  return callback(true, Page);
  // return callback(false, null);
};

class ReaxpressApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    const path = window.location.pathname;
    this.state = {
      path,
    };
  }
  componentDidMount() {
    window.reaxpress.mounted = true;
    window.reaxpress.addUrlListener(this.handleUrlChange);
  }
  handleUrlChange(path) {
    this.setState({
      path,
    });
  }
  render() {
    let renderComponent = null;
    checkRegisteredRoutes(this.state.path, (exists, Component) => {
      renderComponent = exists
        ? <Component />
        : null;
    });
    return (
      <div>
        {renderComponent}
      </div>
    );
  }
}

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

  checkRegisteredRoutes(pushUrl, (exists, Component) => {
    if (exists && window.reaxpress.mounted) {
      window.reaxpress.updateUrl(pushUrl);
      window.reaxpress.reload();
      e.preventDefault();
    }
  });
}, false);

checkRegisteredRoutes(null, (exists) => {
  if (exists) {
    ReactDOM.render(
      <ReaxpressApp />,
      document.getElementById('app'),
    );
  }
});
