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
      table.boolean('complete');
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

Great! Now we have a fully functioning database model. Let's create some endpoints:

```
./reaxpress.js create todos
./reaxpress.js create todos/add
```

This will give us the route file `routes/todos.jsx` where we can add our server logic, as well as two brand new react components named `Todos` and `TodosAdd` in `src/react/`.

Let's add a form for creating new todos. Open `src/react/TodosAdd`.

Replace:

```html
<Content>
  TodosAdd content
</Content>
```

With:

```html
<Content>
  <h1>Add a Todo</h1>
  <form method="post">
    <div className="form-group">
      <label htmlFor="todo-title">Title</label>
      <input className="form-control" type="text" name="title" id="todo-title" />
    </div>
    <div className="form-group">
      <label htmlFor="todo-description">Description</label>
      <textarea className="form-control" name="description" id="todo-description" />
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
</Content>
```

Now we need to handle the form on the backend. All non-get requests need to be manually created. Open `routes/todos.jsx`. At the top of the file after our module imports, let's add our newly created todos model as well as the users model.

```javascript
import todos from '../models/todos';
import users from '../models/users';
```

and add the following at the very end, after `// end of #reaxpress routes` and before `module.exports = router;`:

```javascript
router.post('/add', async (req, res) => {
  // bail if user is not logged in
  if (typeof req.user === 'undefined') {
    req.flash('You must be logged in to do that.');
    res.redirect('/todos/add');
  }

  // get the current user id
  const userId = await users.fetchId(req.user.username);

  // create our todo
  await todos.create({
    title: req.body.title,
    description: req.body.description,
    userId,
  });

  // return to our todo list
  res.redirect('/todos');
});
```

Great! Now we are creating brand new todos. Now would be a good time to display them on our todos page. While still in `routes/todos.jsx`, edit the top level request starting with `router.get('/', ...` and add the following:

```javascript
reaxpressData.todos = await todos.fetchMany();
```

that route should look like this now:

```javascript
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.todos = await todos.fetchMany();
  reaxpressResponseHandler(req, res, Todos, reaxpressData);
});
```

Now open the file `src/react/Todos` and modify it to use the following:



More coming soon... working on rewriting the cli to handle child routes and regex routes.
