import skeleton from '../../skeleton';
import write from './write';

const createParent = (routes) => {
  // clone the current state of the skeleton.
  const newSkeleton = JSON.parse(JSON.stringify(skeleton));

  // define our new route, aptly called a 'bone'.
  const bone = {
    key: routes.parent,
    routes: [],
  };

  console.log(routes);

  // if a child was not provided, add a route for the parent
  if (routes.child === '') {
    console.log('pushing yo');
    bone.routes.push({
      path: '/',
      component: routes.component,
    });
  }

  // add the parent route to the skeleton.
  newSkeleton.push(bone);

  console.log(JSON.stringify(newSkeleton));

  // write our new skeleton file and return it.
  write(newSkeleton);
  console.log(`...created: '${routes.parent}' in Skeleton.`);
  return newSkeleton;
};

export default createParent;
