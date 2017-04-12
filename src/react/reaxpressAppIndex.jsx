/* eslint no-unused-vars: 0 */
import Account from './Account';
import Admin from './Admin';
import Index from './Index';
import Login from './Login';
import Register from './Register';

// #reaxpress components

import skeleton from '../../reaxpress/skeleton';

if (typeof window !== 'undefined') {
  console.log(skeleton);
  for (let i = 0; i < skeleton.length; i += 1) {
    console.log(skeleton[i]);
  }
}
