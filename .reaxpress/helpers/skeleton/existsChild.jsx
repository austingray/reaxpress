import skeleton from './custom';

const existsChild = (parent, childRoute) => {
  let retVal = false;
  skeleton.forEach((el) => {
    if (parent === el.key) {
      el.routes.forEach((route) => {
        if (route.path === childRoute) {
          console.log('child route existed');
          retVal = true;
        }
      });
    }
  });
  return retVal;
};

export default existsChild;
