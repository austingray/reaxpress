export default args =>
`import express from 'express';
import ${args.component} from '../src/react/${args.component}';
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

// #reaxpress route '/'
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, ${args.component}, reaxpressData);
});

// end of #reaxpress routes

module.exports = router;
`;
