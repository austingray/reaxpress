# Reaxpress

## Overview

_This is a work in progress_

The goal of Reaxpress is to provide an extendable boilerplate for creating React/Express applications that reuse React components on the server and client, and does not require redundant server requests for the client.

As I march towards a 1.0 release, I've decided to post this note/disclaimer. There are undocumented pieces of this project, specifically regarding CMS and Admin functionality, heavily under construction. I would greatly appreciate any constructive criticism and/or requests for functionality. This project is a learning experience for me, and I realize I'm taking a few unconventional approaches. Thank you for checking it out!

## Features:

 - A CLI for generating routes
 - Universal React components without redundant requests from the client side
 - User auth via [Passport](http://passportjs.org/)
 - CMS functionality

## Roadmap to 1.0

  - Make functionality opt-in/out (Auth, CMS) via CLI
  - CLI Admin CRUD generation
  - AJAXify admin CRUD operations and views
  - Convert to SPA (via conditional checks for URI in component)
  - Documentation

## CLI

Current functionality:

```
./reaxpress.js create <route>
./reaxpress.js remove <route>
./reaxpress.js forget <route>
```

1.0 functionality (coming soon):

#### init (todo)

Initialize an empty Reaxpress project.

```
Usage: ./reaxpress.js init [--auth | --cms]

--auth  generate a project with basic Authentication
--cms   generate a project with CMS (will automatically include --auth)
```

#### add (todo)

Patch in boilerplate Authentication or CMS functionality after init. This cannot be undone.

```
Usage: ./reaxpress.js add (--auth | --cms)
```

#### route (todo)

Manage your express routes and generate boilerplate code.

```
Usage:
./reaxpress.js route create <name> [--slug=<name>]
./reaxpress.js route remove <name>
./reaxpress.js route forget <name>
./reaxpress.js route remind <name>
```

There are several routes which cannot be created or removed via the CLI to protect core functionality:

```javascript
[
    'reaxpress',
    'index',
    'error',
    'login', // auth
    'logout', // auth
    'register', // auth
    'account', //auth
    'admin', // cms
]
```

#### cms (todo)

Create a content type with CRUD functionality manageable via the admin panel.

```
./reaxpress.js cms create <table> [--display-name=<name>] [--col=<column_name>.<column_type>]...
./reaxpress.js cms modify <table> ([--add-col=<column_name>.<column_type>]... [--rem-col=<column_name>]...)
./reaxpress.js cms remove <table>
```

## Server -> Client Data Sharing

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

## Installation

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

## Notes

 - A prestart script lives in ./bin/prestart.sh which runs knex migrations, compiles scss, and runs webpack.
 - This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
 - This is not a SPA as each route generates a fresh request from the server but that may change in the future.
 - This project uses [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
