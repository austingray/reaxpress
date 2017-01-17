# Reaxpress

An Express/React boilerplate with a CLI for rapid prototyping.

### Features:

 - A CLI for generating routes and boilerplate code
 - Universal React components for server and client side rendering
 - Data sharing between server and client

### CLI

```
./reaxpress.js create [route]
./reaxpress.js remove [route]
./reaxpress.js forget [route]
```

*create* will:
 - register the route in ./.reaxpress/skeleton.json
 - create a boilerplate express route file ./routes/[route].jsx
 - mount that route file in ./.reaxpress/routes.js
 - create the react components in ./src/react/[route]
 - add the react component as an entry in ./webpack.config.js

*remove*

 - deletes the files that were created above

*forget*
 - unregister the route in skeleton.json.

Forgetting a route means it can no longer be removed using the cli tool and all generated changes must be manually removed. In the future, I may force manual removal of modified boilerplate files to not erase any customizations by accident. This depends on what direction and added functionality the CLI tool may get.

There are several protected routes which cannot be added or deleted to protect core functionality:

    'index', 'reaxpress'

### Server -> Client Data Sharing

There's a middleware in app.js that sets a variable named res.locals.reaxpressData. All of your view data should be stored in that object. It is saved as a string because it will be written directly into our document's head in a script tag.

```javascript
app.use((req, res, next) => {
  res.locals.reaxpressData = JSON.stringify({
    user: req.user || false,
  });
  next();
});
```

If we want to add custom data, we would perform our database call, parse the contents of res.locals.reaxpressData, add our new data, then stringify the updated data back to res.locals.reaxpressData. We then pass our data as a prop in our react component:

```javascript
router.get('/article', (req, res) => {
  const comments = /* fetch comments from database \*/

  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  reaxpressData.comments = comments;

  res.locals.reaxpressData = JSON.stringify(reaxpressData);

  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Article reaxpressData={reaxpressData} />),
    componentJs: 'article',
  });
});
```

We automagically make that data available to our components via the @Reaxpress decorator. All top level components should use the decorator, which will make it available to all child components. The @Reaxpress decorator is a [Higher Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that lives in ./src/react/reaxpress/index.js.

```javascript
@Reaxpress
class Article extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          Article content
        </Page>
        <Footer />
      </div>
    );
  }
}
```

Using @Reaxpress, 'this.props.reaxpressData' will be the same value on the client side as it is on the server side. Any child components that will display custom data should use the @Reaxpress decorator. This will make the global reaxpressData available as this.props.reaxpressData:

```javascript
import React from 'react';
import Reaxpress from '../reaxpress';

@Reaxpress
class Header extends React.Component {
  render() {
    const user = this.props.reaxpressData.user;
    return (
      <header id="header">
        <div id="logo">
          <a href="/">Reaxpress</a>
        </div>
        <div id="user">
          {
            user
              ? `Hello, ${user.username}`
              : <a href="/login">Login</a>
          }
        </div>
      </header>
    );
  }
}
```

If you notice in the code above, Article does not pass any props to the Header component, but using our decorator, the props are made available to it.

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

### Installation

Installation:

```
npm install
```

This project will expect a postgres database

```SQL
CREATE USER <db_user> WITH PASSWORD '<db_password>';
CREATE DATABASE <db_name> OWNER <db_user>;
-- need privileges to install uuid-ossp extension via knex migration
ALTER USER <db_user> WITH SUPERUSER;
```

With defined environment variable:

```bash
export REAXPRESS_CONNECTION_STRING=postgresql://jb_user:randompasswordstring@127.0.0.1:5432/jb_database
```
