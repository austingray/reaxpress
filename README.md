# Reaxpress 0.9.1

Reaxpress (React + Express) is a framework for rapid application prototyping and development.

### Features:

- A CLI for managing routes, generating boilerplate code, and more
- Universal React components on the server and client
- Lightning fast single page app
- State management via the global ReaxpressData object and @Reaxpress decorator
- Basic user auth using [passport](http://passportjs.org/)
- Basic CMS functionality
- Postgres database/Knex SQL query builder
- Bootstrap v4

### Notes

- This project is under development, and is subject to much change prior to hitting version 1.0.0
- This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### Roadmap to v1

- Add state management for the current endpoint
- Finish the CLI functionality for routes
- Finish the CLI functionality for users
- Extend the CLI (?)
- Add tests

### Installation

This project relies on webpack.

```
npm install -g webpack
```

And since we want to run migrations in our project directory using the Knex CLI

```
npm install -g knex
```

then

```
npm install
```

This project will expect a Postgres database.

```SQL
CREATE USER <db_user> WITH PASSWORD '<db_password>';
CREATE DATABASE <db_name> OWNER <db_user>;
-- need privileges to install uuid-ossp extension via knex migration
ALTER USER <db_user> WITH SUPERUSER;
```

With defined environment variable:

```
export REAXPRESS_CONNECTION_STRING=postgresql://username:password@127.0.0.1:5432/database
```

### The CLI

```
./reaxpress.js create <route>
./reaxpress.js remove <route>
./reaxpress.js user create <username> <password> <role>
```

### Getting Started

*"To destroy is always the first step in any creation."* - E.E. Cummings

We're going to walk through the creation of a todo app using Reaxpress from start to finish.

```
git clone git@github.com:austingray/reaxpress.git reaxpress-todo-app
cd reaxpress-todo-app
npm install
```

Let's create a database migration file with Knex

```
knex --knexfile=.knex/knexfile.js migrate:make todo
```

Edit the newly created migration file:

```javascript
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('todos', (table) => {
      table.increments().primary();
      table.timestamps(true, true);
      table.integer('created_by').references('users.id');
      table.string('title');
      table.string('description');
      table.string('complete');
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('todos'),
  ]);
};
```

Then run the migration:

```
knex --knexfile=.knex/knexfile.js migrate:latest
```

Now let's create a database model file:

```
touch models/todos.js
```

and add some custom methods:

```javascript
const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

export default {
  async fetchOne(id) {
    try {
      const todo = await knex.raw(`
        SELECT * FROM todos
        WHERE id = ${id}
      `);
      return todo.rows.length > 0
        ? todo.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  },
  async fetchMany(offset = 0, _limit = 0) {
    const limit = _limit === 0
      ? 'ALL'
      : _limit;
    try {
      const todos = await knex.raw(`
        SELECT * FROM todos
        OFFSET ${offset}
        LIMIT ${limit}
      `);
      return todos.rows.length > 0
        ? todos.rows
        : [];
    } catch (err) {
      throw new Error(err);
    }
  },
  async create(args) {
    try {
      return await knex.raw(`
        INSERT INTO todos (title, description, created_by)
        VALUES ('${args.title}', '${args.description}', ${args.userId})
      `);
    } catch (err) {
      throw new Error(err);
    }
  },
  async update(args) {
    const update = await knex.raw(`
      UPDATE todos
      SET
        title = '${args.title}',
        description = '${args.description}',
        complete = ${args.complete}
      WHERE id = ${args.id}
    `);
    return update;
  },
  async delete(id) {
    try {
      return await knex.raw(`
        DELETE FROM todos
        WHERE id = ${id}
      `);
    } catch (err) {
      throw new Error(err);
    }
  },
};
```

Great! Now we have a fully functioning database model. Let's create an endpoint:

...

More coming soon... working on rewriting the cli to handle child routes and regex routes.
