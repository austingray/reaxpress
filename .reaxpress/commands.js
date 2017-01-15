/* eslint consistent-return: 0, no-shadow: 0 */
const fs = require('fs');
const path = require('path');

const routeFileJs = path.join(__dirname, 'routes.jsx');
const webpackConfigFile = path.join(__dirname, '..', 'webpack.config.js');
const template = require('./template');

const helper = require('./helper');

module.exports = {

  create: (name) => {
    // bail if route exists
    if (helper.routeExists(name)) {
      return false;
    }

    // update app.js
    let routeContent = '';
    try {
      routeContent = fs.readFileSync(routeFileJs, 'utf8');
    } catch (err) {
      return console.log(`There was a problem reading from ${routeFileJs}`);
    }
    routeContent = routeContent.replace(/#route-def/g, `#route-def\nconst ${name} = require('../routes/${name}');`);
    routeContent = routeContent.replace(/#route-mount/g, `#route-mount\nrouter.use('/${name}', ${name});`);
    try {
      fs.writeFileSync(routeFileJs, routeContent);
    } catch (err) {
      return console.log(`There was a problem writing to ${routeFileJs}`);
    }

    // add react components
    const reactDirPath = path.join(__dirname, '..', 'src/react/', name);
    const reactFile = path.join(reactDirPath, 'index.jsx');
    try {
      fs.mkdirSync(reactDirPath);
    } catch (err) {
      return console.log(`There was an error creating directory: '${reactDirPath}'`);
    }
    const componentCode = template.component(name);
    try {
      fs.writeFileSync(reactFile, componentCode);
    } catch (err) {
      return console.log(`There was an error writing component code to: '${reactFile}'`);
    }

    // create route file
    const routeFile = path.join(__dirname, '..', 'routes', `${name}.jsx`);
    const routeCode = template.route(name);
    try {
      fs.writeFileSync(routeFile, routeCode);
    } catch (err) {
      return console.log(`There was an error writing route code to '${routeFile}'`);
    }

    let webpackCode = '';
    try {
      webpackCode = fs.readFileSync(webpackConfigFile, 'utf8');
    } catch (err) {
      return console.log(`There was a problem reading from webpack config file: ${webpackConfigFile}`);
    }
    webpackCode = webpackCode.replace(/entry: {/g, `entry: {\n    ${name}: './src/react/${name}',`);
    try {
      fs.writeFileSync(webpackConfigFile, webpackCode);
    } catch (err) {
      return console.log(`There was an error writing to webpack config file: ${webpackConfigFile}`);
    }

    console.log(`Successfully created route: ${name}`);
  },

};
