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
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

// validate admin requests
const validateAdminRequest = async (req, res, next) => {
  if (
    typeof req.user === 'undefined' ||
    !await users.isAdmin(req.user.username)
  ) {
    res.status(404);
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.page = {
      title: 'Error: 404',
      content: 'There was a problem processing your request or this page simply does not exist.',
    };
    return reaxpressResponseHandler(req, res, Page, reaxpressData);
  }

  return next();
};

router.get('/', validateAdminRequest, (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Admin, reaxpressData);
});

router.get('/pages', validateAdminRequest, (req, res) => {
  pages.fetch({}, (allPages) => {
    const rd = res.locals.reaxpressData;
    rd.pages = allPages;
    if (req.query.reaxpress === 'true') { return res.json(rd); }
    return res.send(template(rd, renderToString(<AdminPages reaxpressData={rd} />)));
  });
});

router.get('/pages/:id', validateAdminRequest, (req, res) => {
  pages.fetchPageById(req.params.id, (page) => {
    const rd = res.locals.reaxpressData;
    rd.page = page;
    if (req.query.reaxpress === 'true') { return res.json(rd); }
    return res.send(template(rd, renderToString(<AdminPagesUpdate reaxpressData={rd} />)));
  });
});

router.post('/pages/:id', validateAdminRequest, async (req, res) => {
  const page = req.body;
  const userId = await users.fetchId(req.user.username);
  page.user_id = userId;
  pages.savePage(page, () => {
    res.redirect('/admin/pages');
  });
});

router.delete('/pages/:id', validateAdminRequest, (req, res) => {
  pages.deleteById(req.params.id, () => {
    res.send('/admin/pages');
  });
});

module.exports = router;
