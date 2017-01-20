import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ErrorTemplate from '../src/react/error';

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
    body: 'There was a problem processing your request or this page simply does not exist.',
  };
  res.locals.reaxpressData = JSON.stringify(reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<ErrorTemplate reaxpressData={reaxpressData} />),
    componentJs: 'error',
  });
});

module.exports = router;
