import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Admin from '../src/react/admin';

const router = require('express').Router();
const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

const getUserRole = (username, callback) => {
  knex.raw(`
    SELECT u.role
    FROM users u
    WHERE u.username = '${username}'
  `).then((user) => {
    callback(user.rows[0].role);
  });
};

router.get('/', (req, res, next) => {
  if (!req.user) {
    next();
    return;
  }
  getUserRole(req.user.username, (role) => {
    const roleVal = Number(role);
    console.log(roleVal);
    if (isNaN(roleVal)) {
      next();
      return;
    }
    if (roleVal < 1) {
      next();
      return;
    }
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<Admin reaxpressData={reaxpressData} />),
      componentJs: 'admin',
    });
  });
});

module.exports = router;
