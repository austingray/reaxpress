import React from 'react';
import { renderToString } from 'react-dom/server';
import template from '../template';

export default (req, res, Component, reaxpressData) => {
  if (req.query.reaxpress === 'true') {
    return res.json(reaxpressData);
  }
  return res.send(
    template(
      reaxpressData,
      renderToString(<Component reaxpressData={reaxpressData} />),
    ),
  );
};
