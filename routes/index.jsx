// modules
import express from 'express';
import passport from 'passport';
import React from 'react';
import { renderToString } from 'react-dom/server';
// models
import Models from '../models/index';
// react components
import Homepage from '../src/react/App/Homepage';
import Login from '../src/react/App/Login';
import Register from '../src/react/App/Register';
import Account from '../src/react/App/Account';
import Page from '../src/react/App/_global/Page';
import template from '../template';
import reaxpressResponseHandler from './reaxpressResponseHandler';

const router = express.Router();

/*
 * GET
*/
router.get('/', (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Homepage, reaxpressData);
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

  const users = new Models.Users();

  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.user = await users.fetchOne(req.user.username);

  reaxpressResponseHandler(req, res, Account, reaxpressData);
});

// pages
router.use(async (req, res, next) => {
  const pages = new Models.Pages();

  const reqUrl = req.originalUrl.split('?')[0];
  const page = await pages.fetchByUrl(reqUrl);
  if (!page) {
    return next();
  }
  const isReaxpress = req.originalUrl.indexOf('reaxpress=true') > -1;
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.page = page;
  if (isReaxpress) { return res.json(reaxpressData); }
  return res.send(template(reaxpressData, renderToString(<Page reaxpressData={reaxpressData} />)));
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
  const reqPassword = req.body.password;
  const reqPasswordAgain = req.body.passwordAgain;
  // twitter style usernames
  const allowedRegex = /^[a-zA-Z0-9_]{1,15}$/;

  const users = new Models.Users();

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

  const existingUser = await users.fetch(reqUsername, 'username');

  if (existingUser.length > 0) {
    req.flash('error', 'That username is taken. Please try again..');
    res.redirect('/register');
    return;
  }

  await users.create(reqUsername, reqPassword);

  passport.authenticate('local')(req, res, () => {
    req.flash('success', `Welcome, ${reqUsername}.`);
    res.redirect('/account');
  });
});

module.exports = router;
