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

  // Tests point DATABASE_PATH at a unique temp file per suite (see
  // tests/setupEnv.js). It deliberately is not ':memory:' — the legacy routes
  // talk to SQLite through the raw `sqlite3` driver in database/database.js
  // rather than through Knex, and two drivers cannot share one in-memory
  // database. A temp file is the only way both see the same schema and rows.
  // Single connection because concurrent writers to one SQLite file lock.
  test: {
    ...sqliteConfig(),
    pool: { min: 1, max: 1 },
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
