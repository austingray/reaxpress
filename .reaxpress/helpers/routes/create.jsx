import createParent from './createParent';
import createChild from './createChild';
import exists from './exists';
import existsChild from './existsChild';

export default (parsedArgs) => {
  if (!exists(parsedArgs)) {
    createParent(parsedArgs);
  }
  if (parsedArgs.child !== '' && !existsChild(parsedArgs)) {
    createChild(parsedArgs);
  }
};
