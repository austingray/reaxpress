export default parsedArgs =>
`import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ${parsedArgs.component} from '../src/react/${parsedArgs.component}';
import template from '../template';
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

// #reaxpress route '/'
router.get('/', async (req, res) => {
  // res.locals.reaxpressData passes the app state on the server
  const reaxpressData = res.locals.reaxpressData;
  // customize the reaxpress app state here, for example:
  // reaxpressData.custom = { key: 'value' };

  // pass it on to the response handler
  reaxpressResponseHandler(req, res, ${parsedArgs.component}, reaxpressData);
});

// end of #reaxpress routes

module.exports = router;
`;
