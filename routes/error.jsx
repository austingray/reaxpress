// react components
import reaxpressResponseHandler from './reaxpressResponseHandler';
import Page from '../src/react/App/_global/Page';

const router = require('express').Router();

router.use((req, res, next) => {
  res.locals.status = 404;
  next();
});

// error handler
router.use((req, res) => {
  const status = res.locals.status || 500;
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.status = status;
  reaxpressData.page = {
    title: `Error: ${status}`,
    content: 'There was a problem processing your request or this page simply does not exist.',
  };
  reaxpressResponseHandler(req, res, Page, reaxpressData, status);
});

module.exports = router;
