export default args =>
`// #reaxpress start route '${args.child}'
router.get('${args.child}', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, ${args.component}, reaxpressData);
});
// #reaxpress end route '${args.child}'
`;
