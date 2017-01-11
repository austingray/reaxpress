import Index from '../src/react/index';

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Index />),
    componentJs: 'index',
  });
});

module.exports = router;
