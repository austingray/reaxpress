/* eslint max-len: 0 */
// modules
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Page from '../src/react/_global/Page';
import Admin from '../src/react/Admin';
import AdminPages from '../src/react/Admin/Pages';
import AdminPagesUpdate from '../src/react/Admin/Pages/Update';

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
      content: 'There was a problem processing your request or this page simply does not exist.',
    };
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    return res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<Page reaxpressData={reaxpressData} />),
      componentJs: 'page',
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
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.pages = allPages;
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<AdminPages reaxpressData={reaxpressData} />),
      componentJs: 'adminPages',
    });
  });
});

router.get('/pages/:id', validateAdminRequest, (req, res) => {
  pages.fetchPageById(req.params.id, (page) => {
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.page = page;
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<AdminPagesUpdate reaxpressData={reaxpressData} />),
      componentJs: 'adminPagesUpdate',
    });
  });
});

router.post('/pages/:id', validateAdminRequest, (req, res) => {
  const page = req.body;
  users.getUserIdFromUsername(req.user.username, (userId) => {
    page.user_id = userId;
    pages.savePage(page, () => {
      res.redirect('/admin/pages');
    });
  });
});

router.delete('/pages/:id', validateAdminRequest, (req, res) => {
  pages.deleteById(req.params.id, () => {
    res.send('/admin/pages');
  });
});

module.exports = router;
