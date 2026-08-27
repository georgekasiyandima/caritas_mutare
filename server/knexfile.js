/**
 * Knex configuration — SQLite locally unless a Neon/Postgres URL is set.
 * Tests always use a temp SQLite file, even if DATABASE_URL is in `.env`,
 * so the suite never hits production data.
 *
 * This API is a long-running Express process that also runs Knex migrations
 * on boot. Prefer the **direct** (non-pooler) URL:
 *   DATABASE_URL_UNPOOLED  first, then DATABASE_URL
 * PgBouncer pooled hosts (`-pooler` in the hostname) can break migrations
 * (`prepared statement already exists`). Knex already pools connections.
 *
 * Run from server directory: `npm run migrate` / `npm run seed`
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

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

function postgresUrl() {
  return process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
}

function postgresConfig() {
  const connectionString = postgresUrl();
  const needsSslFlag =
    connectionString && !/[?&]sslmode=/i.test(connectionString);
  return {
    client: 'pg',
    connection: needsSslFlag
      ? `${connectionString}${connectionString.includes('?') ? '&' : '?'}sslmode=require`
      : connectionString,
    pool: { min: 0, max: 10 },
    migrations,
    seeds,
  };
}

function databaseConfig() {
  return postgresUrl() ? postgresConfig() : sqliteConfig();
}

module.exports = {
  development: databaseConfig(),

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

  production: databaseConfig(),
};
