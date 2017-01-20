const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

const pages = {};

pages.fetch = ({ offset = 0, limit = 0 }, callback) => {
  const queryLimit = limit === 0
    ? 'ALL'
    : limit;
  knex.raw(`
    SELECT pages.*
    FROM pages
    OFFSET ${offset}
    LIMIT ${queryLimit}
  `).then((model) => {
    let allPages = {};
    if (model.rows.length > 0) {
      allPages = model.rows;
    }
    return callback(allPages);
  });
};

pages.fetchPageFromRequestUrl = (reqUrl, callback) => {
  let reqPage = false;
  let reqSlug = reqUrl.split('/');
  reqSlug.shift();
  reqSlug = reqSlug.join('/');
  pages.fetch({}, (allPages) => {
    allPages.forEach((page) => {
      if (page.slug === reqSlug) {
        reqPage = page;
      }
    });
    callback(reqPage);
  });
};

module.exports = pages;
