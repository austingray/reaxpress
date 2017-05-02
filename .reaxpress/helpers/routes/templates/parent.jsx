export default args =>
`import express from 'express';
import reaxpressResponseHandler from './reaxpressResponseHandler';
// #reaxpress custom components
import ${args.component} from '../src/react/App/${args.component}';

const router = express.Router();

// #reaxpress route '/'
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, ${args.component}, reaxpressData);
});

// end of #reaxpress routes

module.exports = router;
`;
