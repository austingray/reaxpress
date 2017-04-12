import skeleton from './custom';
import write from './write';

const removeChild = (parent, child) => {
  const newSkeleton = JSON.parse(JSON.stringify(skeleton));
  newSkeleton.forEach((el) => {
    if (el.key === parent) {
      const index = el.routes.indexOf(child);
      el.routes.splice(index, 1);
    }
  });
  write(newSkeleton);
  console.log(`...removed: '${child}' from ${parent} in Skeleton.`);
};

export default removeChild;
