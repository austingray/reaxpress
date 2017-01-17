import Index from '../src/react/index';

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const router = express.Router();

router.get('/', (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  reaxpressData.test = 'test';
  res.locals.reaxpressData = JSON.stringify(reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Index reaxpressData={reaxpressData} />),
    componentJs: 'index',
  });
});

module.exports = router;
