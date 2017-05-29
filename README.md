# Reaxpress v0.11.0

Reaxpress (React + Express) is a (very) opinionated framework for rapid application prototyping.

## Core Concepts

Before diving in, I think it's important to understand the "why" here. Reaxpress is ultimately one person's personal prototyping framework. It was designed to have everything I wanted out of the box when prototyping an app. That being the case, Reaxpress expects you to do everything a certain way. Reaxpress uses Express as a server backend, and you should have some functional understanding of Express before continuing. Reaxpress uses React to handle views, and you should have some functional understanding of React before continuing.

#### Routing

Reaxpress expects you to create every `GET` route with the command line utility. For example, if you wanted your app to have a page that was `www.example.com/users`, essentially serving up a list of all users, you would create that in the command line with `./reaxpress.js route users`. This would create the file `routes/users.jsx` which would have boilerplate server side code for handling `GET` requests to that route. You would then have to edit that request handler in that file, fetch all users with the `Users` database model (I'll get into the database in a little bit), and attach it to the server response. You can nest routes when creating them, for example `./reaxpress.js route users/admins`. This will add a `GET` request handler to the `routes/users.jsx` file for `www.example.com/users/admins`.

When you create your route via the CLI, it saves data about it in a file buried inside of the `./reaxpress` folder. The Router uses that file when handling inter-page requests, which allows Reaxpress to run as a "Single Page App". If a `GET` route is created without using the CLI, then the Router has no way of knowing that endpoint exists or what component to mount when it gets there.

*Reaxpress only cares about `GET` requests*. `POST` and other types of requests should be manually added. If you have an endpoint that has no get requests, then you should prefix that with `/api/`. This project may build out some default api routes as part of its core in the future to demonstrate.

#### Views

Views are created with React components. When you create a route via the CLI, you will get a corresponding React component. For example, if you run the command `./reaxpress.js route users`, the file `src/react/App/Users/index.jsx` will be created. This file will have a React component named `Users` that will be rendered whenever someone visits `www.example.com/users`. The name of the generated component is based on your route, and can be overridden with the option `--component=CustomNameHere` when creating a route. Every folder inside of `src/react/App` is essentially a standalone endpoint for a `GET` request. Reusable components are inside of `_global`. Feel free to add custom global components there or create your own directory structure.

#### State

If you're used to developing React applications, then you are used to some kind of state management. Every React component has a state. Well in Reaxpress, our state is dictated by the global `window.reaxpressData` object. This object originates server side on every request, and is key to our universal React components being able to render on the server and client without any hiccups.

The `reaxpressData` object originates on every request in the `app.js` file, where the user is attached to it. Take a look at that now. It is attached to `res.locals` which is then passed throughout the request chain for the lifecycle of the request. Inside of your `GET` request handler, you grab the `reaxpressData` object from `res.locals`, attach any kind of custom data you want, then pass it to the `reaxpressResponseHandler` function, which then makes it available to our React component via the `@Reaxpress` decorator. The `@Reaxpress` decorator automagically gives any component it decorates access to the global app state via `this.props.reaxpressData`.

If you want to update your app state on the client, all you do is run `window.reaxpress.update(newState)` where `newState` is an object with any properties you want to update in `reaxpressData`. The update function will merge your newState object with the existing object, then re-render any component that depends on that data. You can see an example of this in action in the Todo app tutorial.

#### Database

Reaxpress uses a Postgres database. It also uses Knex.js as a query builder. You should familiar yourself with Knex if you're serious about building an app with Reaxpress (or Node.js for that matter). Knex has a command line tool for creating and running migrations. You will see an example of that if you read on and do the Todo app tutorial. All Knex files/migrations/seeds are kept in the project's `/.knex` folder.

In lieu of using an ORM, I just use Knex and build my own database methods. These methods are all kept inside of the `/models` folder. There is a base `Model` class inside of `models/_model.jsx`. The prescribed way for handling database interactions on any custom tables you create would be to generate a model file along with it. If you run the command `/.reaxpress.js model <table_name>`, a boilerplate model file will be created and a reference will be created inside of `models/index.jsx`, so that specific model will be available whenever you import your Models. I recommend reading on the default methods inside of the `model/_model.js` file (documentation coming asap). All database methods are [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

To be clear, you can easily add an ORM to your project if that's your cup of tea. You'll see example usage of these database models however if you follow the Todo app tutorial.

#### Ok I Got It!

If you haven't been scared off yet and are ready to get your hands dirty, read on `:)`. Please be aware that this project is heavily under construction and is subject to breaking changes leading up to a 1.0 release. I am grateful for any contributions, issues, pull requests, discussions. I can be found on Freenode IRC in the #reaxpress channel.

### Features

- A CLI for managing app routes and generating boilerplate code
- [Express.js](https://expressjs.com/) server backend
- Universal [React](https://facebook.github.io/react/) components for views
- A custom router for single page app functionality
- Custom state management
- Basic user authentication using [passport.js](http://passportjs.org/)
- Basic CMS functionality
- Postgres database/[Knex](http://knexjs.org/) SQL query builder
- [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
- [Docker](https://www.docker.com/community-edition) support
- This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### Installation

```
npm install
```

After install, the command-line tools for `webpack` and `knex` will be available among other important dependencies.

This project will expect a Postgres database. If you do not currently have Postgres, the easiest way to get it installed on macOS is with [Postgres.app](https://postgresapp.com/). After install, open the terminal, access the postgres command line with psql and run the following:

```SQL
CREATE USER <db_user> WITH PASSWORD '<db_password>';
CREATE DATABASE <db_name> OWNER <db_user>;
-- need privileges to install uuid-ossp extension via knex migration
ALTER USER <db_user> WITH SUPERUSER;
```

#### Environment Variables

For \*nix systems
```bash
export NODE_ENV: development
export REAXPRESS_CONNECTION_STRING=postgresql://username:password@127.0.0.1:5432/database
```

For Windows systems
```bash
SET NODE_ENV=development
SET REAXPRESS_CONNECTION_STRING=postgresql://username:password@127.0.0.1:5432/database
```

If you're not sure where to put these, you can just rename the file `.env.example` to `.env` then set these variables there. Then include it in your app by editing `app.js`: at the very top of the file, add the following line: `require('dotenv').config()`.

### Getting Started

Run the default knex database migration

```bash
npm run db:migrate
```

then start the development server

```bash
npm run start:dev
```

Aside from starting your server, this will start a watch process for any changes for both your React components and your SCSS files. The dev server uses nodemon to watch for any changes to your server files, however there seems to be some issues with nodemon and it does not always restart. You may have to restart the server for some server-side changes to take effect.

Your site will now be accessible by navigating your browser to http://localhost:3000

### Getting Started -- With Docker!

Install Docker and start it up if you haven't already.  
>If you're on a windows machine, this project uses linux containers, which is the default. But if you've changed to Windows Containers, you'll need to switch back.

From the root of the project, run

```bash
docker-compose up --build
```

Website:  http://localhost:3000

Database is exposed on the default port of 5432.

Currently there's no "watch", so if you want to use it for debugging, you will need to stop and restart each time.

### The Reaxpress CLI

```
./reaxpress.js route <route> [--delete, --component=CustomName]
./reaxpress.js model <name>
```

### The "Todo" App Tutorial

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
npm run db:migrate
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

Ok! Let's start the server and check it all out. Run `npm run start:dev`, let the thing compile, then navigate your browser to `http://localhost:3000/todos/add`. Go ahead and add a few todos.

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

### FAQ

- I am getting "UnhandledPromiseRejectionWarning: Unhandled promise rejection" in my console, what should I do? - https://github.com/austingray/reaxpress/issues/6
