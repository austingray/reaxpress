# Reaxpress

The CLI has had a massive overhaul, and the information below is out of date. I have been converting this to a single page app where all GET endpoints are managed via the CLI. When using the cli, `create` and `remove` are functioning, but many things below are changing. Documentation will be updated once the conversion to an SPA is completed.

### Overview

The goal of Reaxpress (React + Express) is to provide an extendable application boilerplate for rapid prototyping.

### Features:

 - A CLI for managing routes and generating boilerplate
 - Universal React components
 - Ubiquitous view state data between server and client
 - Basic user auth using [passport](http://passportjs.org/)
 - Basic CMS functionality
 - State management (coming soon)
 - Single page app (coming soon)

### CLI

```
./reaxpress.js create <route>
./reaxpress.js remove <route>
```

*create*:
 - creates a reference in the project skeleton.
 - creates a boilerplate express route file.
 - creates a react component
 - some behind the scenes which will be documented in detail once the SPA aspect is completed

*remove*
 - deletes any files that were created above (cannot undo this, so be careful)

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

In `app.js`, the global reaxpressData variable is created and saved as `res.locals.reaxpressData`. All application state should be stored in that object. Below is the generic middleware that is used to first initiate the reaxpressData object:

```javascript
app.use((req, res, next) => {
  res.locals.reaxpressData = {
    user: req.user || false,
  };
  next();
});
```

To add route specific view data, follow the example below:

```javascript
router.get('/article/:id', (req, res) => {
  // get view specific data
  const article = fetchArticle(req.params.id);

  // grab our global reaxpressData
  const reaxpressData = res.locals.reaxpressData;

  // add our view specific data to the global object
  reaxpressData.article = article;

  // render our view, passing the updated global object as a prop
  res.send(template(reaxpressData, renderToString(<Article reaxpressData={reaxpressData} />)));
});
```

The contents of reaxpressData are automagically made available to React components via the `@Reaxpress` decorator, which is a [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that lives in `./src/react/_global/reaxpress/index.js`.

```javascript
import React from 'react';
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
```

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
 - This project uses [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
