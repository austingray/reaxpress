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
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

/*
 * GET
*/
router.get('/', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Index, reaxpressData);
});

router.get('/login', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Login, reaxpressData);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Register, reaxpressData);
});

router.get('/account', async (req, res) => {
  if (typeof req.user === 'undefined') {
    res.redirect('/login');
    return;
  }

  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.user = await users.fetchOne(req.user.username);

  reaxpressResponseHandler(req, res, Account, reaxpressData);
});

// pages
router.use((req, res, next) => {
  const reqUrl = req.originalUrl.split('?')[0];
  pages.fetchPageFromRequestUrl(reqUrl, (page) => {
    if (!page) {
      return next();
    }
    const isReaxpress = req.originalUrl.indexOf('reaxpress=true') > -1;
    const reaxpressData = res.locals.reaxpressData;
    reaxpressData.page = page;
    if (isReaxpress) { return res.json(reaxpressData); }
    return res.send(template(reaxpressData, renderToString(<Page reaxpressData={reaxpressData} />)));
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

router.post('/register', async (req, res) => {
  const reqUsername = req.body.username;
  const reqPassworeaxpressData = req.body.passworeaxpressData;
  const reqPassworeaxpressDataAgain = req.body.passworeaxpressDataAgain;
  // twitter style usernames
  const allowedRegex = /^[a-zA-Z0-9_]{1,15}$/;

  // bail on invalid username
  if (!allowedRegex.test(reqUsername)) {
    req.flash('error', 'Invalid username. Please try again.');
    res.redirect('/register');
    return;
  }

  // bail on passworeaxpressData mismatch
  if (reqPassworeaxpressData !== reqPassworeaxpressDataAgain) {
    req.flash('error', 'PassworeaxpressData mismatch. Please try again.');
    res.redirect('/register');
    return;
  }

  const exists = await users.exists(reqUsername);

  if (exists) {
    req.flash('error', 'That username is taken. Please try again..');
    res.redirect('/register');
    return;
  }

  await users.create(reqUsername, reqPassworeaxpressData);

  passport.authenticate('local')(req, res, () => {
    req.flash('success', `Welcome, ${reqUsername}.`);
    res.redirect('/account');
  });
});

module.exports = router;
