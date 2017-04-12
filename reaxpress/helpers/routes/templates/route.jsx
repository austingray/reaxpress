export default parsedArgs =>
`import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ${parsedArgs.component} from '../src/react/${parsedArgs.component}';
import template from '../template';

const router = express.Router();

// #reaxpress route '/'
router.get('/', (req, res) => {
  // res.locals.reaxpressData passes the app state on the server
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  // customize the reaxpress app state here, for example:
  reaxpressData.custom = { key: 'value' };

  // if the url has ?reaxpress=true appended,
  // it means it's a fresh request to an endpoint.
  // send back just the app state
  if (req.params.reaxpress) {
    return res.json(reaxpressData);
  }

  // otherwise, this is the entry point of the app,
  // send a server render and mount it on the front end.
  // res.locals.reaxpressData is embedded in the server response
  res.locals.reaxpressData = JSON.stringify(reaxpressData);
  return res.send(template(reaxpressData, renderToString(<${parsedArgs.component} />)));
});

// end of #reaxpress routes

module.exports = router;
`;
