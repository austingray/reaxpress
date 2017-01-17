# Reaxpress

An Express/React boilerplate with a CLI for rapid prototyping.

### Features:

 - Universal React components for server and client side rendering
 - A CLI for generating routes and boilerplate code

### CLI

The gist of the command line integration is you can create/remove/forget routes which are tracked in ./.reaxpress/skeleton.json. Reaxpress will generate boilerplate code, including the express route, a basic react component, and modifications to the webpack config file.

    ./reaxpress.js create [route]
    ./reaxpress.js remove [route]
    ./reaxpress.js forget [route]

'create' will:
 - register the route in ./.reaxpress/skeleton.json
 - create a boilerplate express route file ./routes/[route].jsx
 - mount that route file in ./.reaxpress/routes.js
 - create the react components in ./src/react/[route]
 - add the react component as an entry in ./webpack.config.js

'remove' does the inverse.

'forget' will unregister the route with the skeleton.json file. This means it can no longer be removed using the cli tool and all generated changes must be manually removed.

In the future, I may force manual removal of modified boilerplate files to not erase any customizations by accident. This depends on what direction and added functionality the CLI tool may get.

There is one protected route, 'index' which cannot be added/deleted.

### Server -> Client Data Sharing

There's a middleware in app.js that sets a variable named res.locals.reaxpressData. All of your view data should be stored in that object. It is saved as a string because it will be written directly into our template, in a script tag in the document's head.

    app.use((req, res, next) => {
      res.locals.reaxpressData = JSON.stringify({
        user: req.user || false,
      });
      next();
    });

If we want to add custom view data for a route:

    router.get('/article', (req, res) => {
      // database call to fetch an article's comments
      const comments = ...
      // convert res.locals.reaxpressData back to an object and add our custom data
      const reaxpressData = JSON.parse(res.locals.reaxpressData);
      reaxpressData.comments = comments;
      // JSON.stringify() the updated reaxpressData and save back to res.locals.reaxpressData
      res.locals.reaxpressData = JSON.stringify(reaxpressData);
      // pass the reaxpressData to handle server side data rendering
      res.render('template.ejs', {
        templateHtml: ReactDOMServer.renderToString(<Article reaxpressData={reaxpressData} />),
        componentJs: 'article',
      });
    });

We send all of our view data server side as a prop named reaxpressData. We serve a JSON.stringify() version of the same data to the front end via res.locals.reaxpressData.

We can automagically use that data by using the @Reaxpress decorator. The Reaxpress decorator is a [Higher Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that lives in ./src/react/reaxpress/index.js which makes that reaxpressData available to your components.

    import React from 'react';
    import Reaxpress from '../reaxpress';

    @Reaxpress
    class Header extends React.Component {
      render() {
        const user = this.props.reaxpressData.user;
        return (
          <header id="header">
            <div className="logo">
              <a href="/">Reaxpress</a>
            </div>
            <div className="user">
              {
                user
                  ? `Hello, ${user.username}`
                  : <LoginBox />
              }
            </div>
          </header>
        );
      }
    }

Using @Reaxpress, 'this.props.reaxpressData.user' will be the same value on the client side as it is on the server side.

### Under the hood

 - This code is built on top of the default code you get when creating a new project with the [Express application generator](https://expressjs.com/en/starter/generator.html).
 - The view engine uses ejs just for the template file and uses universal server/client React components.
 - A prestart script lives in ./bin/prestart.sh which runs knex migrations, compiles scss, and runs webpack.
 - This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
 - This is not a SPA as each route generates a fresh request from the server but that may change in the future.
 - This project uses [Bootstrap v4](https://v4-alpha.getbootstrap.com/)

### Todo

 - Basic user auth
 - Basic CMS functionality

### Setup

Installation:

    npm install

This project will expect a postgres database

    CREATE USER <db_user> WITH PASSWORD '<db_password>';
    CREATE DATABASE <db_name> OWNER <db_user>;
    -- need privileges to install uuid-ossp extension via knex migration
    ALTER USER <db_user> WITH SUPERUSER;

With defined environment variable:

    export REAXPRESS_CONNECTION_STRING=postgresql://jb_user:randompasswordstring@127.0.0.1:5432/jb_database
