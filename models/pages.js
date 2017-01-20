const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

const pages = {};

pages.fetch = ({ offset = 0, limit = 0 }, callback) => {
  knex.raw(`
    SELECT pages.*
    FROM pages
    OFFSET ${offset}
    LIMIT ${limit}
  `).then((model) => {
    let allPages = {};
    if (model.rows.length > 0) {
      allPages = model.rows;
    }
    return callback(allPages);
  });
};

module.exports = pages;
