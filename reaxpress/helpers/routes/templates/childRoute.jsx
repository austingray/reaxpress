export default parsedArgs =>
`// #reaxpress start route '${parsedArgs.child}'
router.get('${parsedArgs.child}', (req, res) => {
  // res.locals.reaxpressData passes the app state on the server
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  // customize the reaxpress app state here, for example:
  reaxpressData.custom = { key: 'value' };

  // if the url has ?reaxpress=true appended,
  // it means it's a fresh request to an endpoint.
  // send back just the app state
  if (req.params.reaxpress) {
    return res.json(reaxpressData);
  }

  // otherwise, this is the entry point of the app,
  // send a server render and mount it on the front end.
  // res.locals.reaxpressData is embedded in the server response
  res.locals.reaxpressData = JSON.stringify(reaxpressData);
  return res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<${parsedArgs.component} />),
  });
});
// #reaxpress end route '${parsedArgs.child}'
`;
