import path from 'path';
import create from './create';
import removeParent from './removeParent';
import removeChild from './removeChild';

export default {
  create,
  removeParent,
  removeChild,
  getRouteFilePath(args) {
    // reject bad arguments
    if (typeof args.parent !== 'string' || args.parent === '') {
      console.log('Error getting route file path:');
      console.log(`type: ${typeof args.parent}`);
      console.log(`value: ${args.parent}`);
      throw new Error(`Error in ${path.join(__dirname, 'index.jsx')}`);
    }
    // route file is always named after the parent
    return path.join(__dirname, '../../..', 'routes', `${args.parent}.jsx`);
  }
};
