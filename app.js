require('babel-register');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const favicon = require('serve-favicon');

const app = express();

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'This is the dawning of the age of aquarius.',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
require('./passport.config.js')();

// reaxpress globals
app.use((req, res, next) => {
  res.locals.reaxpressData = {
    user: req.user || false,
  };
  next();
});

// #reaxpress: generated routes
app.use(require('./.reaxpress/mount'));

// error handling
app.use(require('./routes/error'));

module.exports = app;
