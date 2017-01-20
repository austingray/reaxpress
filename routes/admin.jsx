import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Admin from '../src/react/admin';
import ErrorTemplate from '../src/react/error';

const router = require('express').Router();
const users = require('../models/users');

// validate admin requests
// router.use(/^\/admin.*/,
const validateAdminRequest = (req, res, next) => {
  users.isAdmin(req.user, (isAdmin) => {
    if (isAdmin) {
      return next();
    }
    res.status(404);
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.page = {
      title: `Error: ${status}`,
      body: 'There was a problem processing your request or this page simply does not exist.',
    };
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    return res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<ErrorTemplate reaxpressData={reaxpressData} />),
      componentJs: 'error',
    });
  });
};

router.get('/', validateAdminRequest, (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Admin reaxpressData={reaxpressData} />),
    componentJs: 'admin',
  });
});

module.exports = router;
