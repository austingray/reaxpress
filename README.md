# Reaxpress

A boilerplate bundled with a CLI for rapid Express/React prototyping.

Features:

 - A CLI for generating routes and boilerplate code
 - Universal React components for server and client side rendering

What this is not:

 - This is not a SPA (may change in the future).

### Usage

Or call the script directly

    ./reaxpress/reaxpress <cmd> <arg>

Commands:

    ./reaxpress/reaxpress route <name>

This will:
 - register the route in ./reaxpress/skeleton.json
 - link the route to your app via ./reaxpress/routes.jsx
 - create the file ./routes/<name>.jsx with boilerplate get functionality
 - create ./src/react/<name>/index.jsx with boilerplate component
 - modify ./webpack.config.js to add your new component as an entry point

### Setup and Installation

This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react). Install a linter (Atom editor):

    apm install linter-eslint

Installation:

    npm install

This project uses a postgres database

    CREATE USER <db_user> WITH PASSWORD '<db_password>';
    CREATE DATABASE <db_name> OWNER <db_user>;
    -- need privileges to install uuid-ossp extension via knex migration
    ALTER USER <db_user> WITH SUPERUSER;

Need to define environment variables:

    export NODE_ENV=development
    export REAXPRESS_CONNECTION_STRING=postgresql://jb_user:randompasswordstring@127.0.0.1:5432/jb_database
