/* eslint arrow-body-style: 0, comma-dangle: 0 */
const bcrypt = require('bcrypt');
const validator = require('validator');
// users data
const adminHash = bcrypt.hashSync('admin', 10);
const userHash = bcrypt.hashSync('user', 10);
// pages data
const aboutContent = validator.escape(`
<p>The goal of Reaxpress is to provide an extendable boilerplate for creating React/Express applications that reuse React components on the server and client, and does not require redundant server requests to render the client-side view.</p>

<h2>Features:</h2>
<ul>
  <li>A CLI for generating routes and boilerplate code</li>
  <li>Universal React components</li>
  <li>Ubiquitous view state data between server and client</li>
  <li>Basic user auth using passport</li>
  <li>Basic CMS functionality (coming soon)</li>
</ul>

<p>This is boilerplate content</p>
`);


exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return Promise.join(
    // users
    knex('users').del(),
    knex('users').insert({ id: 1, uuid: knex.raw('uuid_generate_v4()'), username: 'admin', hash: adminHash, role: 10 }),
    knex('users').insert({ id: 2, uuid: knex.raw('uuid_generate_v4()'), username: 'user', hash: userHash, role: 0 }),
    // pages
    knex('pages').del(),
    knex('pages').insert({ id: 1, uuid: knex.raw('uuid_generate_v4()'), created_by: 1, slug: 'about', title: 'About Reaxpress', content: aboutContent })
  );
};
