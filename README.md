# Reaxpress

### Overview

The goal of Reaxpress is to provide an extendable boilerplate for creating React/Express applications that reuse React components on the server and client, and does not require redundant server requests to render the client-side view.

### Features:

 - A CLI for generating routes and boilerplate code
 - Universal React components
 - Ubiquitous view state data between server and client
 - Basic user auth using [passport](http://passportjs.org/)
 - Basic CMS functionality (coming soon)

### CLI

```
./reaxpress.js create <route>
./reaxpress.js remove <route>
./reaxpress.js forget <route>
```

*create*:
 - register the route in `./.reaxpress/skeleton.json`
 - create a boilerplate express route file `./routes/[route].jsx`
 - mount that route file in `./.reaxpress/routes.js`
 - create the react components in `./src/react/[route]/index.jsx`
 - add the react component as an entry in `./webpack.config.js`

*remove*
 - deletes the route reference and any files that were created above

*forget*
 - unregister the route in `./.reaxpress/skeleton.json`.

Forgetting a route means it can no longer be removed using the cli tool and all generated changes must be manually removed. In the future, modified boilerplate files may need to be manually removed as to not erase any customizations by accident. This depends on what direction and added functionality the CLI tool may get.

There are several protected routes which cannot be added or deleted to protect core functionality:

    'reaxpress',
    'index',
    'login',
    'logout',
    'register',
    'account',
    'admin',
    'error',

### Server -> Client Data Sharing

In `app.js`, the global reaxpressData variable is created and saved as `res.locals.reaxpressData`. All React component data should be stored in that object. It is saved as a string because it will be written directly into our document's head in a script tag, making it available to the client-side render.

```javascript
app.use((req, res, next) => {
  res.locals.reaxpressData = JSON.stringify({
    user: req.user || false,
  });
  next();
});
```

To add route specific view data, parse the contents of `res.locals.reaxpressData`, add the data, then stringify it back to `res.locals.reaxpressData`. Pass the regular object as a prop to our react component.

```javascript
router.get('/article/:id', (req, res) => {
  // get view specific data
  const article = fetchArticle(req.params.id);

  // grab our global reaxpressData
  const reaxpressData = JSON.parse(res.locals.reaxpressData);

  // add our view specific data to the global object
  reaxpressData.article = article;

  // save our updated object back to res.locals
  res.locals.reaxpressData = JSON.stringify(reaxpressData);

  // render our view, passing the updated global object as a prop
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<Article reaxpressData={reaxpressData} />),
    componentJs: 'article',
  });
});
```

The contents of reaxpressData are automagically made available to React components via the `@Reaxpress` decorator, which is a [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that lives in `./src/react/reaxpress/index.js`. Inside your top level components, if `document` is not undefined, then `ReactDOM.render()` is called to mount the component on the client. All of this code is included when using the CLI tool to generate a route.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Article extends React.Component {
  const article = this.props.reaxpressData.article;
  render() {
    return (
      <div>
        <Header />
        <Page>
          <h1>{article.title}</h1>
          <div>{article.text}</div>
        </Page>
        <Footer />
      </div>
    );
  }
}

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Article />,
    document.getElementById('app'),
  );
}
```

Using the `@Reaxpress` decorator, `this.props.reaxpressData` will be the same on the client side as it is on the server. Any child components that display that data should use the decorator to access it.

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

In the code above, `Article` does not pass any props to the `Header` component, but using our decorator, `this.props.reaxpressData` is made available to it.

### Installation

```
npm install
```

This project will expect a Postgres database

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

### Notes

 - A prestart script lives in ./bin/prestart.sh which runs knex migrations, compiles scss, and runs webpack.
 - This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
 - This is not a SPA as each route generates a fresh request from the server but that may change in the future.
 - This project uses [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
