import bcrypt from 'bcrypt';
import Model from './_model';

const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

/**
 * 'users' database table methods
 */
export default class Users extends Model {
  constructor() {
    super();
    this.model = 'users';
  }

  /**
   * Creates a new user
   * @param  {String}  username
   * @param  {String}  password
   * @param  {String}  [role='user'] Translates this string to an integer value
   * @return {Object}
   */
  async create(username, password, role = 'user') {
    const roleVal = role === 'admin'
      ? 10
      : 0;
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const user = await knex.raw(`
        INSERT INTO ${this.model} (username, hash, role)
        VALUES ('${username}', '${hash}', ${roleVal})
        RETURNING id, username, created_at, role
      `);
      return user.rows.length > 0
        ? user.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Fetches one user by username
   * @param  {String}  username
   * @return {Object}
   */
  async fetchOne(username) {
    try {
      const user = await knex.raw(`
        SELECT username, created_at, role
        FROM ${this.model} u
        WHERE u.username = '${username}'
      `);
      return user.rows.length > 0
        ? user.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Determine with a user is an admin
   * @param  {String}  username
   * @return {Boolean}
   */
  async isAdmin(username) {
    try {
      const user = await knex.raw(`
        SELECT u.role
        FROM ${this.model} u
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
  }

  /**
   * Fetch a user ID from username
   * @param  {String}  username
   * @return {Integer}
   */
  async fetchId(username) {
    try {
      const user = await knex.raw(`
        SELECT id
        FROM ${this.model}
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
  }
}
