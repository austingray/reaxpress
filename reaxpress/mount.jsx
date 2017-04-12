const router = require('express').Router();

// #route-def
const admin = require('../routes/admin');
const index = require('../routes/index');
// #route-mount
router.use('/admin', admin);
router.use('/', index);

module.exports = router;
