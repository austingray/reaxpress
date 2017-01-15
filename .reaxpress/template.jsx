module.exports = {
  component: (name) => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    return (
`import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

function ${componentName}() {
  return (
    <div>
      <Header />
      <Page>
        ${componentName} content
      </Page>
      <Footer />
    </div>
  );
}

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <${componentName} />,
    document.getElementById('app'),
  );
}

export default ${componentName};
`
    );
  },

  route: (name) => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    return (
`import ${componentName} from '../src/react/${name}';

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<${componentName} />),
    componentJs: '${name}',
  });
});

module.exports = router;
`
    );
  },
};
