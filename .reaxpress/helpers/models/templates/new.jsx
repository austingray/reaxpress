export default name =>
`import Model from './_model';

const knex = require('knex')(require('../.knex/knexfile')[process.env.NODE_ENV]);

export default class ${name.charAt(0).toUpperCase() + name.slice(1)} extends Model {
  constructor() {
    super();
    this.model = '${name}';
  }

  // create custom '${name}' methods here
}
`;
