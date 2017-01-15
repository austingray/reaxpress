# Reaxpress

An Express/React boilerplate with a CLI for rapid prototyping.

### Features:

 - Universal React components for server and client side rendering
 - A CLI for generating routes and boilerplate code

### Under the hood

This code is built on top of the default code you get when creating a new project with the [Express application generator](https://expressjs.com/en/starter/generator.html). The view engine uses ejs just for the template file and uses universal server/client React components. The gist of the command line integration is you can register routes which are tracked in  .reaxpress/skeleton.json. Reaxpress will generate boilerplate code, including the express route, a basic react component, and modifications to the webpack config file. A prestart script lives in ./bin/prestart.sh which will run Knex migrations, compile scss files, and run webpack. This project follows [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react). This is not a SPA as each route generates a fresh request from the server but that may change in the future.

### Usage

    ./reaxpress.js create [route]
    ./reaxpress.js remove [route]
    ./reaxpress.js forget [route]

### Todo

 - Write/Rewrite CLI functionality
 - Create server object for client consumption on page load
 - Basic user auth
 - Basic CMS functionality

### Setup

Installation:

    npm install

This project will expect a postgres database

    CREATE USER <db_user> WITH PASSWORD '<db_password>';
    CREATE DATABASE <db_name> OWNER <db_user>;
    -- need privileges to install uuid-ossp extension via knex migration
    ALTER USER <db_user> WITH SUPERUSER;

With defined environment variable:

    export REAXPRESS_CONNECTION_STRING=postgresql://jb_user:randompasswordstring@127.0.0.1:5432/jb_database
