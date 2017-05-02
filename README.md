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

coming soon...
