// modules
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Admin from '../src/react/admin';
import ErrorTemplate from '../src/react/error';

const router = express.Router();

// validate admin requests
const validateAdminRequest = (req, res, next) => {
  users.isAdmin(req.user, (isAdmin) => {
    if (isAdmin) {
      return next();
    }
    // do 404 if not an admin
    res.status(404);
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.page = {
      title: 'Error: 404',
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

router.get('/pages', validateAdminRequest, (req, res) => {
  pages.fetch({}, (allPages) => {
    res.json(allPages);
  });
});

module.exports = router;
