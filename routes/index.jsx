import Index from '../src/react/index';
import Login from '../src/react/login';
import Register from '../src/react/register';
import Account from '../src/react/account';

const router = require('express').Router();
const passport = require('passport');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const users = require('../models/users');

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
  users.getData(req.user.username, (userData) => {
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.user = userData;
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<Account reaxpressData={reaxpressData} />),
      componentJs: 'account',
    });
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

  users.checkIfUserExists(reqUsername, (exists) => {
    if (exists) {
      req.flash('error', 'That username is taken. Please try again..');
      res.redirect('/register');
      return;
    }
    users.createUser(reqUsername, reqPassword, () => {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome, ${reqUsername}.`);
        res.redirect('/account');
      });
    });
  });
});

module.exports = router;
