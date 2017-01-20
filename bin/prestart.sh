node ./node_modules/knex/bin/cli.js --knexfile .knex/knexfile.js migrate:rollback
node ./node_modules/knex/bin/cli.js --knexfile .knex/knexfile.js migrate:latest --env ${NODE_ENV}
node ./node_modules/knex/bin/cli.js --knexfile .knex/knexfile.js seed:run
node-sass --include-path scss src/scss/style.scss public/build/css/style.css
webpack --progress --colors --display-error-details
