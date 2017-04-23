import 'babel-polyfill';
import assert from 'assert';
import parseRoute from '../.reaxpress/helpers/parseRoute';
import exists from '../.reaxpress/helpers/routes/exists';

// dummy file contents
const routeFileContentsNoChild = `
  router.get('/', async (req, res) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressResponseHandler(req, res, Test, reaxpressData);
  });
`;
const routeFileContentsWithChild = `
  router.get('/', async (req, res) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressResponseHandler(req, res, Test, reaxpressData);
  });
  router.get('/child', async (req, res) => {
    const reaxpressData = res.locals.reaxpressData;
    reaxpressResponseHandler(req, res, Testchild, reaxpressData);
  });
`;

describe('cli.routes.exists', () => {
  it('should return null for all of these values', () => {
    let testRoute = '';
    let testVal = null;

    testRoute = parseRoute('');
    testVal = exists(testRoute);
    assert.equal(testVal, null);

    testRoute = parseRoute({});
    testVal = exists(testRoute);
    assert.equal(testVal, null);

    testRoute = parseRoute(() => {});
    testVal = exists(testRoute);
    assert.equal(testVal, null);
  });

  it('parent should be true for all of these values', () => {
    let testRoute = '';
    let testVal = null;

    testRoute = parseRoute('test');
    testVal = exists(testRoute, routeFileContentsNoChild);
    assert.equal(testVal.parent, true);

    testRoute = parseRoute('test');
    testVal = exists(testRoute, routeFileContentsWithChild);
    assert.equal(testVal.parent, true);
  });

  it('parent should be false for all of these values', () => {
    let testRoute = parseRoute('test');
    let testVal = exists(testRoute, 'lorem ipsum');
    assert.equal(testVal.parent, false);
  });

  it('child should be true for all of these values', () => {
    let testRoute = parseRoute('test/child');
    let testVal = exists(testRoute, routeFileContentsWithChild);
    assert.equal(testVal.child, true);
  });

  it('child should be false for all of these values', () => {
    let testRoute = '';
    let testVal = null;

    testRoute = parseRoute('test/child');
    testVal = exists(testRoute, routeFileContentsNoChild);
    assert.equal(testVal.child, false);

    testRoute = parseRoute('test/asdf');
    testVal = exists(testRoute, routeFileContentsWithChild);
    assert.equal(testVal.child, false);
  });
});
