import skeleton from '../../skeleton';
import write from './write';

const createChild = (routes, currentSkeleton = []) => {
  let newSkeleton = [];
  if (currentSkeleton.length === 0) {
    // if we got a blank object, then the parent already existed,
    // use the existing skeleton.
    newSkeleton = JSON.parse(JSON.stringify(skeleton));
  } else {
    // if there was a currentSkeleton passed, we just created the parent,
    // so use the newly created skeleton
    newSkeleton = JSON.parse(JSON.stringify(currentSkeleton));
  }
  newSkeleton.forEach((el) => {
    if (el.key === routes.parent) {
      el.routes.push({
        path: routes.child,
        component: routes.component,
      });
    }
  });
  write(newSkeleton);
  console.log(`...created: '${routes.parent}${routes.child}' in Skeleton.`);
};

export default createChild;
