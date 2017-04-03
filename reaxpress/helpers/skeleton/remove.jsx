import skeleton from '../../skeleton';
import write from './write';

const remove = (name) => {
  let index = -1;
  const newSkeleton = JSON.parse(JSON.stringify(skeleton));
  newSkeleton.forEach((el, i) => {
    if (el.key === name) {
      index = i;
    }
  });
  if (index === -1) {
    console.log(`'${name}' could not be removed: not found.`);
    return;
  }
  newSkeleton.splice(index, 1);
  write(newSkeleton);
  console.log(`...removed: '${name}' from Skeleton.`);
};

export default remove;
