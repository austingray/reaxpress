/* eslint consistent-return: 0, no-shadow: 0 */
const fs = require('fs');
const path = require('path');

const webpackConfigFile = path.join(__dirname, '..', 'webpack.config.js');
const appFile = path.join(__dirname, 'routes.jsx');
const template = require('./template');

const mkdirSync = (path) => {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

const helper = require('./helper');

module.exports = {

  create: (name) => {
    // bail if route exists
    if (helper.checkIfRouteExists(name)) {
      return false;
    }

    console.log(name);
    // update app.js
    fs.readFile(appFile, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      let modified = data.replace(/#route-def/g, `#route-def\nconst ${name} = require('../routes/${name}');`);
      modified = modified.replace(/#route-mount/g, `#route-mount\nrouter.use('/${name}', ${name});`);
      fs.writeFile(appFile, modified, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log('successfully added route to app file.');
      });
    });
    // add react components if they do not already exist
    const reactDirPath = path.join(__dirname, '..', 'src/react/', name);
    const reactFile = path.join(reactDirPath, 'index.jsx');
    mkdirSync(reactDirPath);
    const componentCode = template.component(name);
    fs.writeFile(reactFile, componentCode, 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('successfully created react component file.');
    });
    // create route file
    const routeFile = path.join(__dirname, '..', 'routes', `${name}.jsx`);
    const routeCode = template.route(name);
    fs.writeFile(routeFile, routeCode, 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('successfully created route file.');
    });
    // update webpack.config.js
    fs.readFile(webpackConfigFile, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const modified = data.replace(/entry: {/g, `entry: {\n    ${name}: './src/react/${name}',`);
      fs.writeFile(webpackConfigFile, modified, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log('successfully added entry to webpack config file.');
      });
    });
  },

};
