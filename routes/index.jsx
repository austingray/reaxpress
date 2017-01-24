// modules
import express from 'express';
import passport from 'passport';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Index from '../src/react/Index';
import Login from '../src/react/Login';
import Register from '../src/react/Register';
import Account from '../src/react/Account';
import Page from '../src/react/_global/Page';

const router = express.Router();

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

// pages
router.use((req, res, next) => {
  pages.fetchPageFromRequestUrl(req.originalUrl, (page) => {
    if (!page) {
      return next();
    }
    const reaxpressData = JSON.parse(res.locals.reaxpressData);
    reaxpressData.page = page;
    res.locals.reaxpressData = JSON.stringify(reaxpressData);
    return res.render('template.ejs', {
      templateHtml: ReactDOMServer.renderToString(<Page reaxpressData={reaxpressData} />),
      componentJs: 'page',
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
