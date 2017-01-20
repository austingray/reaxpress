const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);
const bcrypt = require('bcrypt');

const users = {};

users.checkIfUserExists = (username, callback) => {
  let exists = true;
  knex.raw(`
    SELECT u.*
    FROM users u
    WHERE u.username = '${username}'
  `).then((clients) => {
    if (clients.rows.length === 0) {
      exists = false;
    }
    callback(exists);
  });
};

users.createUser = (username, password, callback) => {
  bcrypt.genSalt(10, (genSaltErr, salt) => {
    bcrypt.hash(password, salt, (hashErr, hash) => {
      knex.raw(`
        INSERT INTO users (username, hash)
        VALUES ('${username}', '${hash}')
      `).then(() => {
        callback();
      });
    });
  });
};

users.getData = (username, callback) => {
  knex.raw(`
    SELECT
      u.username,
      u.created_at,
      u.role
    FROM users u
    WHERE u.username = '${username}'
  `).then((user) => {
    if (user.rows.length === 0) {
      callback({});
      return;
    }
    callback(user.rows[0]);
  });
};

users.getRole = (username, callback) => {
  knex.raw(`
    SELECT u.role
    FROM users u
    WHERE u.username = '${username}'
  `).then((user) => {
    callback(user.rows[0].role);
  });
};

users.isAdmin = (reqUser, callback) => {
  // if user is not logged in, fail
  if (typeof reqUser === 'undefined') {
    return callback(false);
  }
  const username = reqUser.username;
  return knex.raw(`
    SELECT u.role
    FROM users u
    WHERE u.username = '${username}'
  `).then((model) => {
    const user = model.rows[0];
    // if no user with username, fail
    if (typeof user === 'undefined') {
      return callback(false);
    }
    const role = Number(user.role);
    // if role isNaN, or less than 1, fail
    if (isNaN(role) || role < 1) {
      return callback(false);
    }
    // user is admin
    return callback(true);
  });
};

module.exports = users;
