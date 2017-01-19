import Index from '../src/react/Index';
import Login from '../src/react/login';
import Register from '../src/react/register';
import Account from '../src/react/account';

const express = require('express');
const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);
const passport = require('passport');
const bcrypt = require('bcrypt');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const router = express.Router();

const checkIfUserExists = (username, callback) => {
  let exists = true;
  knex.raw(`
    SELECT u.*
    FROM users u
    WHERE u.username = '${username}'
  `).then((clients) => {
    if (clients.rows.length === 0) {
      exists = false;
    }
    callback(exists);
  });
};

/*
 * GET
*/
router.get('/', (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Index reaxpressData={reaxpressData} />),
    componentJs: 'index',
  });
});

router.get('/login', (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Login reaxpressData={reaxpressData} />),
    componentJs: 'login',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Register reaxpressData={reaxpressData} />),
    componentJs: 'register',
  });
});

router.get('/account', (req, res) => {
  if (typeof req.user === 'undefined') {
    res.redirect('/login');
    return;
  }
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Account reaxpressData={reaxpressData} />),
    componentJs: 'account',
  });
});

/*
 * POST
*/

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res) => {
  res.redirect('/account');
});

router.post('/register', (req, res) => {
  const reqUsername = req.body.username;
  const reqPassword = req.body.password;
  const reqPasswordAgain = req.body.passwordAgain;
  // twitter style usernames
  const allowedRegex = /^[a-zA-Z0-9_]{1,15}$/;

  // bail on invalid username
  if (!allowedRegex.test(reqUsername)) {
    req.flash('error', 'Invalid username. Please try again.');
    res.redirect('/register');
    return;
  }

  // bail on password mismatch
  if (reqPassword !== reqPasswordAgain) {
    req.flash('error', 'Password mismatch. Please try again.');
    res.redirect('/register');
    return;
  }

  checkIfUserExists(reqUsername, (exists) => {
    if (exists) {
      req.flash('error', 'That username is taken. Please try again..');
      res.redirect('/register');
      return;
    }
    bcrypt.genSalt(10, (genSaltErr, salt) => {
      bcrypt.hash(reqPassword, salt, (hashErr, hash) => {
        knex.raw(`
          INSERT INTO users (username, hash)
          VALUES ('${reqUsername}', '${hash}')
        `).then(() => {
          passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome, ${reqUsername}.`);
            res.redirect('/account');
          });
        });
      });
    });
  });
});

module.exports = router;
