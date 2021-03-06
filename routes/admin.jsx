/* eslint max-len: 0 */
// modules
import express from 'express';
// models
import Models from '../models';
// react components
import Page from '../src/react/App/_global/Page';
import Admin from '../src/react/App/Admin';
import AdminPages from '../src/react/App/Admin/Pages';
import AdminPagesUpdate from '../src/react/App/Admin/Pages/Update';
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

// validate admin requests
const validateAdminRequest = async (req, res, next) => {
  const users = new Models.Users();
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
  reaxpressData.pages = await new Models.Pages().fetchMany();
  reaxpressResponseHandler(req, res, AdminPages, reaxpressData);
});

router.get('/pages/:id', validateAdminRequest, async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.page = await new Models.Pages().fetchById(req.params.id);
  reaxpressResponseHandler(req, res, AdminPagesUpdate, reaxpressData);
});

router.post('/pages/:id', validateAdminRequest, async (req, res) => {
  const page = req.body;
  const userId = await new Models.Users().fetchId(req.user.username);
  page.user_id = userId;
  await new Models.Pages().savePage(page);
  res.redirect('/admin/pages');
});

router.delete('/pages/:id', validateAdminRequest, async (req, res) => {
  await new Models.Pages().deleteById(req.params.id);
  res.send('/admin/pages');
});

module.exports = router;
