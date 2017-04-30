const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

export default class Model {
  constructor() {
    this.model = '';
  }
  /**
   * Create a new entry in the table
   * @param  {Object}  args the new entry's key/values
   * @return {Object}       the new entry
   */
  async create(args) {
    try {
      const todo = await knex(`${this.model}`)
        .insert(args)
        .returning('*');
      return todo;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Select from the table by a single value
   * @param  {Mixed}   value  The value for the where clause
   * @param  {String}  key    Optional key, defaults to 'id'
   * @return {Array}          An array of objects
   */
  async fetch(value, key = 'id') {
    try {
      const returnVal = await knex(`${this.model}`)
        .select('*')
        .where(key, value);
      return returnVal;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Select from the table with advanced arguments
   * @param  {Object}          args   Optional query arguments
   * @param  {Object.<object>} where  Key, value pair for a where clause
   * @param  {Object.<number>} offset Offset value
   * @param  {Object.<number>} limit  Limit value
   * @return {Array}                  An array of objects
   */
  async fetchMany(args = {}) {
    try {
      let query = knex(`${this.model}`).select('*');
      if (typeof args.where === 'object') {
        const key = Object.keys(args.where)[0];
        const val = args.where[key];
        query = query.where(key, val);
      }
      if (typeof args.offset === 'number') {
        query = query.offset(args.offset);
      }
      if (typeof args.limit === 'number') {
        query = query.limit(args.offset);
      }
      return await query;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * update a single entry in the table
   * @param  {Object}  args key/values to be updated
   * @return {Object}       the updated entry
   */
  async update(args) {
    try {
      const todo = await knex(`${this.model}`)
        .where('id', args.id)
        .update(args)
        .returning('*');
      return todo;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * delete a single entry from the table
   * @param  {number}  id the id of the entry you wish to delete
   * @return {Null}
   */
  async delete(id) {
    try {
      return await knex.raw(`
        DELETE FROM '${this.model}'
        WHERE id = ${id}
      `);
    } catch (err) {
      throw new Error(err);
    }
  }
}
