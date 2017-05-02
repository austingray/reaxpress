// these route names cannot be used by the CLI
const blacklist = [
  'index',
  'homepage',
  'reaxpress',
  'login',
  'logout',
  'register',
  'account',
];

module.exports = {
  test(route) {
    const testVal = route.split('/')[0];
    if (blacklist.includes(testVal)) {
      console.log(`Route '${testVal}' is a protected route.`);
      return true;
    }
    return false;
  },
};
