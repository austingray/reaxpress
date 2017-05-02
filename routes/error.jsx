// modules
import React from 'react';
import { renderToString } from 'react-dom/server';
// react components
import Page from '../src/react/App/_global/Page';
import template from '../template';

const router = require('express').Router();

router.use((req, res, next) => {
  res.locals.status = 404;
  next();
});

// error handler
router.use((req, res) => {
  const status = res.locals.status || 500;
  res.status(status);
  const rd = res.locals.reaxpressData;
  rd.page = {
    title: `Error: ${status}`,
    content: 'There was a problem processing your request or this page simply does not exist.',
  };
  const isReaxpress = req.originalUrl.indexOf('reaxpress=true') > -1;
  if (isReaxpress) { return res.json(rd); }
  return res.send(template(rd, renderToString(<Page reaxpressData={rd} />)));
});

module.exports = router;
