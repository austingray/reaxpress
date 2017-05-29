import React from 'react';
import { renderToString } from 'react-dom/server';
import template from '../template';

export default (req, res, Component, reaxpressData, status = true) => {
  if (req.query.reaxpress === 'true') {
    return res.json(reaxpressData);
  }
  if (status !== true) {
    res.status(status);
  }
  return res.send(
    template(
      reaxpressData,
      renderToString(<Component reaxpressData={reaxpressData} />),
    ),
  );
};
