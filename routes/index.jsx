// modules
import express from 'express';
import passport from 'passport';
import React from 'react';
import { renderToString } from 'react-dom/server';
// models
import users from '../models/users';
import pages from '../models/pages';
// react components
import Index from '../src/react/Index';
import Login from '../src/react/Login';
import Register from '../src/react/Register';
import Account from '../src/react/Account';
import Page from '../src/react/_global/Page';
import template from '../template';

const router = express.Router();

/*
 * GET
*/
router.get('/', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  res.send(template(reaxpressData, renderToString(<Index reaxpressData={reaxpressData} />)));
});

router.get('/login', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  res.send(template(reaxpressData, renderToString(<Login reaxpressData={reaxpressData} />)));
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  res.send(template(reaxpressData, renderToString(<Register reaxpressData={reaxpressData} />)));
});

router.get('/account', (req, res) => {
  if (typeof req.user === 'undefined') {
    res.redirect('/login');
    return;
  }
  users.getData(req.user.username, (userData) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.user = userData;
    res.send(template(reaxpressData, renderToString(<Account reaxpressData={reaxpressData} />)));
  });
});

// pages
router.use((req, res, next) => {
  pages.fetchPageFromRequestUrl(req.originalUrl, (page) => {
    if (!page) {
      next();
      return;
    }
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.page = page;
    res.send(template(reaxpressData, renderToString(<Page reaxpressData={reaxpressData} />)));
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
