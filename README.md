# Reaxpress v0.10.3

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
./reaxpress.js route <route> [--delete, --component=CustomName]
./reaxpress.js user create <username> <password> <role>
./reaxpress.js model <name>
```

### Getting Started

*"To destroy is always the first step in any creation."* - E.E. Cummings

We're going to walk through the creation of a todo app using Reaxpress from start to finish.

```bash
git clone git@github.com:austingray/reaxpress.git reaxpress-todo-app
cd reaxpress-todo-app
npm install
```

Let's create a database migration file with Knex

```bash
knex --knexfile=.knex/knexfile.js migrate:make todo
```

Edit the newly created migration file:

```javascript
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('todos', (table) => {
      table.increments().primary();
      table.timestamps(true, true);
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

```bash
knex --knexfile=.knex/knexfile.js migrate:latest
```

Now let's create a database model file using the CLI:

```bash
./reaxpress model todos
```

This will generate a model file that extends our base model class and provides the following methods for the table `todos`:

```
create
fetch
fetchMany
update
delete
```

Check out the file `models/_model.jsx` to see expected arguments and return values (and/or check back for updated documentation).

Great! Now we have a fully functioning database model. Let's create some endpoints:

```
./reaxpress.js route todos
./reaxpress.js route todos/add
```

This created the following files:

```
routes/todos.jsx
src/react/App/Todos/index.jsx
src/react/App/TodosAdd/index.jsx
```

`routes/todos.jsx` is where we will handle our back end logic while the 2 new files in the react directories are the corresponding front end views for each endpoint.

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

Now we need to handle the form on the backend. All non-get requests need to be manually created. Open `routes/todos.jsx`. At the top of the file after our module imports, let's import our database models.

```javascript
import Models from '../models';
```

and add the following at the very end, after `// end of #reaxpress routes` and before `module.exports = router;`:

```javascript
router.post('/add', async (req, res) => {
  await new Models.Todos().create(req.body);
  res.redirect('/todos');
});
```

Navigate your browser to `http://localhost:3000/todos/add` and add a few todos.

All done? Great! Now would be a good time to display them on our todos page. While still in `routes/todos.jsx`, edit the top level request which begins with `router.get('/', ...` and add the following:

```javascript
const todos = new Models.Todos();
reaxpressData.todos = await todos.fetchMany();
```

that route should look like this now:

```javascript
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.todos = await new Models.Todos().fetchMany();
  reaxpressResponseHandler(req, res, Todos, reaxpressData);
});
```

While we're at it, let's drop in another POST route to the bottom of the file after our previous `/add` post endpoint. This next one will handle updates, which we will use to mark our todos as completed:

```javascript
router.post('/update/:id', async (req, res) => {
  await new Models.Todos().update(req.body);
  res.sendStatus(204);
});
```

Now open the file `src/react/Todos` and update the component to be the following:

```javascript
@Reaxpress
class Todos extends React.Component {
  completeTodo(todo) {
    // create our new todo
    const updatedTodo = Object.assign({}, todo, {
      complete: !todo.complete,
    });

    // update our application on the front end
    window.reaxpress.update({
      todos: this.props.reaxpressData.todos.map((oldTodo) => {
        if (oldTodo.id === todo.id) {
          return updatedTodo;
        }
        return oldTodo;
      }),
    });

    // send it to the server to be updated
    $.ajax({
      url: `/todos/update/${todo.id}`,
      method: 'POST',
      data: updatedTodo,
      success() {},
    });
  }
  render() {
    const todos = this.props.reaxpressData.todos;
    return (
      <div>
        <Header />
        <Content>
          <h1>Your Todo List</h1>
          <div className="list-group">
            {
              todos.map(todo =>
                <a
                  key={todo.id}
                  onClick={() => { this.completeTodo(todo); }}
                  className="list-group-item list-group-item-action flex-column align-items-start"
                  style={{ opacity: (todo.complete ? 0.2 : 1) }}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{todo.title}</h5>
                    <small>{todo.created_at.toString()}</small>
                  </div>
                  <p className="mb-1">{todo.description}</p>
                </a>,
              )
            }
          </div>
          <a href="/todos/add">Add a New Todo</a>
        </Content>
        <Footer />
      </div>
    );
  }
}
```

This might seem like a lot but break down the above code to see how Reaxpress is handling application state. More detailed tutorial breakdown coming soon.
