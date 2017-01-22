const validator = require('validator');
const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);
const slug = require('slug');

slug.mode = slug.defaults.mode = 'rfc3986';

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
    let allPages = [];
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

pages.fetchPageById = (id, callback) => {
  if (id === 'new') {
    return callback({});
  }
  return knex.raw(`
    SELECT p.*
    FROM pages p
    WHERE p.id = ${id}
  `).then((model) => {
    let page = {};
    if (model.rows.length > 0) {
      page = model.rows[0];
    }
    return callback(page);
  });
};

pages.savePage = (page, callback) => {
  const pageId = Number(page.id);
  const pageTitle = validator.escape(page.title);
  const pageContent = validator.escape(page.content);
  const pageSlug = slug(page.slug);
  const pageUserId = Number(page.user_id);
  if (isNaN(pageId)) {
    knex.raw(`
      INSERT INTO pages (title, slug, content, created_by)
      VALUES ('${pageTitle}', '${pageSlug}', '${pageContent}', ${pageUserId})
    `).then(() => {
      callback();
    });
  } else {
    knex.raw(`
      UPDATE pages
      SET
        title = '${pageTitle}',
        slug = '${pageSlug}',
        content = '${validator.escape(pageContent)}'
      WHERE id = ${pageId}
    `).then(() => {
      callback();
    });
  }
};

pages.deleteById = (pageId, callback) => {
  const pageIdInt = Number(pageId);
  if (isNaN(pageIdInt)) {
    callback();
    return;
  }
  knex.raw(`
    DELETE FROM pages
    WHERE id = ${pageIdInt}
  `).then(() => {
    callback();
  });
};

module.exports = pages;
