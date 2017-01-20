/* eslint arrow-body-style: "off" */
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      const adminHash = bcrypt.hashSync('admin', 10);
      const userHash = bcrypt.hashSync('user', 10);
      return Promise.all([
        knex('users').insert({ id: 1, uuid: knex.raw('uuid_generate_v4()'), username: 'admin', hash: adminHash, role: 10 }),
        knex('users').insert({ id: 2, uuid: knex.raw('uuid_generate_v4()'), username: 'user', hash: userHash, role: 0 }),
      ]);
    });
};
