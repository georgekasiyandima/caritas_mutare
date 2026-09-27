const knex = require('knex');
const knexfile = require('../knexfile');

const env = process.env.KNEX_ENV || process.env.NODE_ENV || 'development';
const config = knexfile[env] || knexfile.development;

// sqlite3 is a devDependency, so production installs don't have it.
if (process.env.NODE_ENV === 'production' && config.client !== 'pg') {
  throw new Error('DATABASE_URL (Postgres) is required in production');
}

module.exports = knex(config);
