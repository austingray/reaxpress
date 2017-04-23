import createParent from './createParent';
import createChild from './createChild';
import exists from './exists';
import existsChild from './existsChild';

export default (args) => {
  const routesExist = exists(args);
  if (!routesExist.parent) {
    createParent(parsedArgs);
  }
  if (!routesExist.child) {
    createChild(parsedArgs);
  }
};
