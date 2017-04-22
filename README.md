# Reaxpress

Reaxpress (React + Express) is a framework for rapid application prototyping and development.

### Features:

- A CLI for managing routes, generating boilerplate code, and more
- Universal React components on the server and client
- Lightning fast single page app
- State management via the global ReaxpressData object and @Reaxpress decorator
- Basic user auth using [passport](http://passportjs.org/)
- Basic CMS functionality

### Installation

This project relies on webpack.

```
npm install -g webpack
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

```bash
export REAXPRESS_CONNECTION_STRING=postgresql://username:password@127.0.0.1:5432/database
```

### Getting Started

*"To destroy is always the first step in any creation."* - E.E. Cummings

```
./reaxpress.js create <route>
./reaxpress.js remove <route>
./reaxpress.js user <action>
```

The CLI is core to developing with Reaxpress. All `GET` routes should be created using the command `./reaxpress.js create <route>`. Let's walk through an example.

We're going to create a page that displays all users. Navigate to your project dir and type `./reaxpress.js create userlist`. You should see the following output:

```
...created: 'userlist' in Skeleton.
...created: /path/to/project/src/react/Userlist/index.jsx
...created: /path/to/project/routes/userlist.jsx
...mounted: 'userlist' in /path/to/project/.reaxpress/mount.jsx
Successfully created route: userlist
```

What does it all mean? The Skeleton is the internal route handler for Reaxpress. It makes the app aware of what routes are in the project, and facilitates rendering the correct React components on their desired endpoints. The next line is the React component that we will be rendering when a user visits that endpoint. After that is the Express route handler. This is where we will be adding custom data from the server. Finally, the reference in mount.js mounts that route file into our app. Along with the Skeleton, we should never have to edit it manually.

To start your server (as well as compile/watch your React components and Sass files), run `npm run-script start-dev`. This is an alias for several scripts. You can which ones by examining the `package.json` file. Navigate your server to `http://localhost:3000`. You should see the text "Userlist content". If you do, you are on the right track.

Next we need to create a custom database method to grab our list of all users. Fortunately, one already exists inside of the `models/users.js` file called `fetchMany`. Fetch many takes two arguments, `offset` and `limit` which default to `0`. Reaxpress keeps all database methods inside of the models folder. The naming convention is still being hammered out, as well as how bloated/lean it will be kept in this repo.

Open `routes/userlist.jsx` and take a look at the boilerplate file that was generated. You will see there's a get route for the path `/`. That path is mounted to `/userlist`, so all requests to that endpoint will be handled here. There's also some boilerplate instructional code. First things first, let's import our users model. After your module imports, add this line:

```javascript
import users from '../models/users';
```

After that clean out the boilerplate/instructional code inside of the default get route, until you have this:

```javascript
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressResponseHandler(req, res, Userlist, reaxpressData);
});
```

Now let's include the `users.fetchMany` method. This is nice and clean since we're using async/await.

```javascript
router.get('/', async (req, res) => {
  const reaxpressData = res.locals.reaxpressData;
  reaxpressData.users = await users.fetchMany();
  reaxpressResponseHandler(req, res, Userlist, reaxpressData);
});
```

Now that our users have been attached to the reaxpressData object, it is available inside of our React component via the @Reaxpress decorator. Let's open the component file which was generated when we created our route: `src/react/Userlist/index.jsx`. You will see that the decorator is automatically added. We're going to update the `render` method of our component. Here's what it looks like before our changes:

```javascript
render() {
  return (
    <div>
      <Header />
      <Content>
        Userlist content
      </Content>
      <Footer />
    </div>
  );
}
```

and after:

```javascript
render() {
  const users = this.props.reaxpressData.users;
  return (
    <div>
      <Header />
      <Content>
        <h1>All Users</h1>
        {
          users.map(user =>
            <div key={user.id}>{user.username}</div>,
          )
        }
      </Content>
      <Footer />
    </div>
  );
}
```

Navigate to `http://localhost:3000/userlist`

Now if you see a blank page, well then you're on the right track! That's because there aren't any users yet. You can go ahead and create a regular user via the /register page. Or... you can create an admin user using the command line:

```
./reaxpress.js user create <username> YourPasswordString admin
```

You should see the following message:

```
Successfully created user:
anonymous {
  id: 5,
  username: 'auger',
  created_at: 2017-04-19T04:32:07.787Z,
  role: 10 }
```

*Note: The `user` cli is very new and its implementation still being hammered out*

Now if you visit the `http://localhost:3000/userlist` endpoint again, you should see your new user in the list.

When you're done with this little experiment, you can run `./reaxpress.js remove userlist`. BE CAREFUL! This is a very powerful command. Not only will it delete the project from the skeleton, it will also remove all of the boilerplate files that were generated, even if they were modified.

### Notes

- This project is under development, and is subject to much change prior to hitting version 1.0.0
- This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- This project uses [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
