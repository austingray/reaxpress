import exists from './exists';
import existsChild from './existsChild';
import createParent from './createParent';
import createChild from './createChild';

const create = (routes) => {
  let newSkeleton = [];
  // if the parent route doesn't yet exist,
  // create it. This will return the skeleton.
  // Since createChild executes in the same process
  // we need to pass the new skeleton or the parent won't exist.
  if (!exists(routes.parent)) {
    newSkeleton = createParent(routes);
  }
  // if the child route does not exist, create it
  if (routes.child !== '' && existsChild(routes.parent, routes.child) === false) {
    createChild(routes, newSkeleton);
  }
};

export default create;
