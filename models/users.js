const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);
const bcrypt = require('bcrypt');

/**
 * 'users' database table methods
 */
export default {
  /**
   * Checks whether a user exists
   * @param  {String}  username
   * @return {Boolean}
   */
  exists: async (username) => {
    try {
      const user = await knex.raw(`
        SELECT 1
        FROM users u
        WHERE u.username = '${username}'
      `);
      return user.rows.length > 0;
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Creates a new user
   * @param  {String}  username
   * @param  {String}  password
   * @param  {String}  [role='user'] Translates this string to an integer value
   * @return {Object}
   */
  create: async (username, password, role = 'user') => {
    const roleVal = role === 'admin'
      ? 10
      : 0;
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await knex.raw(`
        INSERT INTO users (username, hash, role)
        VALUES ('${username}', '${hash}', ${roleVal})
        RETURNING id, username, created_at, role
      `);
      return user.rows.length > 0
        ? user.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Fetches one user by username
   * @param  {String}  username
   * @return {Object}
   */
  fetchOne: async (username) => {
    try {
      const user = await knex.raw(`
        SELECT username, created_at, role
        FROM users u
        WHERE u.username = '${username}'
      `);
      return user.rows.length > 0
        ? user.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Return all users
   * @return {Array}
   */
  fetchAll: async () => {
    try {
      const users = await knex.raw(`
        SELECT id, username, created_at
        FROM users
      `);
      return users.rows;
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Determine with a user is an admin
   * @param  {String}  username
   * @return {Boolean}
   */
  isAdmin: async (username) => {
    try {
      const user = await knex.raw(`
        SELECT u.role
        FROM users u
        WHERE u.username = '${username}'
      `);
      // false if no results
      // or the role is less than 10
      if (
        user.rows.length === 0 ||
        Number(user.rows[0].role) < 9
      ) {
        return false;
      }
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Fetch a user ID from username
   * @param  {String}  username
   * @return {Integer}
   */
  fetchId: async (username) => {
    try {
      const user = await knex.raw(`
        SELECT id
        FROM users
        WHERE username = '${username}'
      `);
      // return ID if the user was found
      // or 0 if not found
      return user.rows.length > 0
        ? Number(user.rows[0].id)
        : 0;
    } catch (err) {
      throw new Error(err);
    }
  },
};
