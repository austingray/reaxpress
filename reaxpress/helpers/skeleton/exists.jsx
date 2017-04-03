import skeleton from '../../skeleton';

const exists = (name) => {
  let retVal = false;
  skeleton.forEach((el) => {
    if (el.key === name) {
      console.log('parent key existed');
      retVal = true;
    }
  });
  return retVal;
};

export default exists;
