/* eslint arrow-body-style: "off" */
exports.up = (knex, Promise) => {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return Promise.all([
      // users
      knex.schema.createTable('users', (table) => {
        table.increments().primary();
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
        table.timestamps(true, true);
        table.string('username').notNullable();
        table.string('hash').notNullable();
        table.string('email').unique().notNullable();
        table.string('first_name');
        table.string('last_name');
      }),
    ]);
  });
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users'),
  ]);
};
