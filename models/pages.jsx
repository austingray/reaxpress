import validator from 'validator';
import slug from 'slug';
import Model from './_model';

const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

slug.mode = slug.defaults.mode = 'rfc3986'; // eslint-disable-line no-multi-assign

export default class Pages extends Model {
  constructor() {
    super();
    this.model = 'pages';
  }
  /**
   * Fetch a page by url
   * @param  {String}  url
   * @return {Object}  a page object
   */
  async fetchByUrl(url) {
    // convert slug to array
    let reqSlug = url.split('/');

    // need to review
    reqSlug.shift();
    reqSlug = reqSlug.join('/');

    // get all pages
    const pages = await this.fetchMany();

    // loop and return the matching slug
    for (let i = 0; i < pages.length; i += 1) {
      if (pages[i].slug === reqSlug) {
        return pages[i];
      }
    }

    // return 0 if no matches
    return 0;
  }
  /**
   * Fetch a page by ID
   * @param  {Integer}  id
   * @return {Object} A page object
   */
  async fetchById(id) {
    // need to review
    if (id === 'new') {
      return {};
    }
    try {
      const page = await knex.raw(`
        SELECT p.*
        FROM ${this.model} p
        WHERE p.id = ${id}
      `);
      return page.rows.length > 0
        ? page.rows[0]
        : {};
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Save a page
   * @param  {Object}  page
   * @return {Null}
   */
  async savePage(page) {
    const pageId = Number(page.id);
    const pageTitle = validator.escape(page.title);
    const pageContent = validator.escape(page.content);
    const pageSlug = slug(page.slug);
    const pageUserId = Number(page.user_id);
    try {
      if (isNaN(pageId)) {
        return await knex.raw(`
          INSERT INTO ${this.model} (title, slug, content, created_by)
          VALUES ('${pageTitle}', '${pageSlug}', '${pageContent}', ${pageUserId})
        `);
      }
      return await knex.raw(`
        UPDATE ${this.model}
        SET
          title = '${pageTitle}',
          slug = '${pageSlug}',
          content = '${validator.escape(pageContent)}'
        WHERE id = ${pageId}
      `);
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Delete a page by ID
   * @param  {Integer}  _id
   * @return {Boolean}  If the operation was successful
   */
  async deleteById(_id) {
    const id = Number(_id);
    if (isNaN(id)) {
      return false;
    }
    try {
      await knex.raw(`
        DELETE FROM ${this.model}
        WHERE id = ${id}
      `);
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
