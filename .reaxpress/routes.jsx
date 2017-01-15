const router = require('express').Router();

// #route-def
const test = require('../routes/test');
// #route-mount
router.use('/test', test);

module.exports = router;
