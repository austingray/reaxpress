module.exports = {

  development: {
    client: 'pg',
    connection: process.env.ERB_PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
