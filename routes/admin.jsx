/* eslint max-len: 0 */
// modules
import express from 'express';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Page from '../src/react/_global/Page';
import Admin from '../src/react/Admin';
import AdminPages from '../src/react/Admin/Pages';
import AdminPagesUpdate from '../src/react/Admin/Pages/Update';
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

router.get('/pages', validateAdminRequest, async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.pages = await pages.fetchMany();
  reaxpressResponseHandler(req, res, AdminPages, reaxpressData);
});

router.get('/pages/:id', validateAdminRequest, async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.page = await pages.fetchById(req.params.id);
  reaxpressResponseHandler(req, res, AdminPagesUpdate, reaxpressData);
});

router.post('/pages/:id', validateAdminRequest, async (req, res) => {
  const page = req.body;
  const userId = await users.fetchId(req.user.username);
  page.user_id = userId;
  await pages.savePage(page);
  res.redirect('/admin/pages');
});

router.delete('/pages/:id', validateAdminRequest, async (req, res) => {
  await pages.deleteById(req.params.id);
  res.send('/admin/pages');
});

module.exports = router;
