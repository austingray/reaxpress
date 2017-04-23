/**
 * Testing the Reaxpress CLI Skeleton create
 */
import 'babel-polyfill';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import parseRoute from '../.reaxpress/helpers/parseRoute';
import decache from 'decache';
const skeletonPath = '../.reaxpress/helpers/skeleton';

const customFilePath = '.reaxpress/helpers/skeleton/custom.jsx'
const fsCustomFilePath = path.join(__dirname, '..', customFilePath);
const skeletonUncache = (callback) => {
  process.nextTick(() => {
    decache(skeletonPath);
    callback(require(skeletonPath));
  });
}

describe('cli.skeleton.exists', () => {
  it(`Returns false if the entry does not exist ${customFilePath}`, () => {
    skeletonUncache((Skeleton) => {
      assert.equal(Skeleton.exists('test'), false);
    });
  });

  it('Returns true after we create an entry and it exists', () => {
    // {"key":"test","routes":[{"path":"/","component":"Test"}]}
    const route = parseRoute('test');
    skeletonUncache((Skeleton) => {
      Skeleton.create(route);
      skeletonUncache((Skeleton) => {
        assert.equal(Skeleton.exists('test'), true);
        skeletonUncache((Skeleton) => {
          Skeleton.remove('test');
        });
      });
    });
  });
});
