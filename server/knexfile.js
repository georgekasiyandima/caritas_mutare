/**
 * Knex configuration — SQLite for local/light production, PostgreSQL when DATABASE_URL is set.
 * Run from server directory: `npm run migrate` / `npm run seed`
 */
const path = require('path');

const sqliteFilename = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');

const migrations = {
  directory: path.join(__dirname, 'migrations'),
};
const seeds = {
  directory: path.join(__dirname, 'seeds'),
};

function sqliteConfig() {
  return {
    client: 'sqlite3',
    connection: { filename: sqliteFilename },
    useNullAsDefault: true,
    migrations,
    seeds,
  };
}

module.exports = {
  development: sqliteConfig(),

  test: {
    ...sqliteConfig(),
    connection: { filename: ':memory:' },
  },

  production: process.env.DATABASE_URL
    ? {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: { min: 0, max: 10 },
        migrations,
        seeds,
      }
    : sqliteConfig(),
};
