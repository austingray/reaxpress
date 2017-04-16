const config = {
  client: 'pg',
  connection: process.env.REAXPRESS_CONNECTION_STRING,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

module.exports = {
  development: config,
  production: config,
};
