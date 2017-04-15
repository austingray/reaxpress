/* eslint max-len: 0 */
// modules
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Page from '../src/react/_global/Page';
import Admin from '../src/react/Admin';
import AdminPages from '../src/react/Admin/Pages';
import AdminPagesUpdate from '../src/react/Admin/Pages/Update';
import template from '../template';

const router = express.Router();

// validate admin requests
const validateAdminRequest = (req, res, next) => {
  users.isAdmin(req.user, (isAdmin) => {
    if (isAdmin) {
      return next();
    }
    // do 404 if not an admin
    res.status(404);
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.page = {
      title: 'Error: 404',
      content: 'There was a problem processing your request or this page simply does not exist.',
    };
    return res.send(template(reaxpressData, renderToString(<Page reaxpressData={reaxpressData} />)));
  });
};

router.get('/', validateAdminRequest, (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  res.send(template(reaxpressData, renderToString(<Admin reaxpressData={reaxpressData} />)));
});

router.get('/pages', validateAdminRequest, (req, res) => {
  pages.fetch({}, (allPages) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.pages = allPages;
    res.send(template(reaxpressData, renderToString(<AdminPages reaxpressData={reaxpressData} />)));
  });
});

router.get('/pages/:id', validateAdminRequest, (req, res) => {
  pages.fetchPageById(req.params.id, (page) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.page = page;
    res.send(template(reaxpressData, renderToString(<AdminPagesUpdate reaxpressData={reaxpressData} />)));
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
