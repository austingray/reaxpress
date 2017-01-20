/* eslint arrow-body-style: "off" */
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      const hashVal = bcrypt.hashSync('admin', 10);
      return Promise.all([
        knex('users').insert({ id: 1, uuid: knex.raw('uuid_generate_v4()'), username: 'admin', hash: hashVal, role: 10 }),
      ]);
    });
};
