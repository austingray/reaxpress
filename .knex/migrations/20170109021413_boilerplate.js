/* eslint arrow-body-style: "off" */
exports.up = (knex, Promise) => {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return Promise.all([
      // users
      knex.schema.createTable('users', (table) => {
        table.increments().primary();
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
        table.timestamps(true, true);
        table.string('username').notNullable().unique();
        table.string('hash').notNullable();
        table.integer('role').defaultTo(0);
      }),
      // pages
      knex.schema.createTable('pages', (table) => {
        table.increments().primary();
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique();
        table.timestamps(true, true);
        table.integer('created_by');
        table.string('slug');
        table.string('title');
        table.text('content');
      }),
    ]);
  });
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('pages'),
    knex.schema.dropTable('users'),
  ]);
};
