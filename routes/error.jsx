// modules
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// react components
import Page from '../src/react/_global/Page';

const router = require('express').Router();

router.use((req, res, next) => {
  res.locals.status = 404;
  next();
});

// error handler
router.use((req, res) => {
  const status = res.locals.status || 500;
  res.status(status);
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  reaxpressData.page = {
    title: `Error: ${status}`,
    content: 'There was a problem processing your request or this page simply does not exist.',
  };
  res.locals.reaxpressData = JSON.stringify(reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Page reaxpressData={reaxpressData} />),
    componentJs: 'page',
  });
});

module.exports = router;
