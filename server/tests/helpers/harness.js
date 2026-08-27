/**
 * Shared test harness.
 *
 * Gives each suite a real Express app backed by a real (temp, per-worker)
 * SQLite database with migrations and seeds applied — the same code path that
 * runs in production, minus the listening socket.
 *
 * Rate limiting is off by default: a suite makes far more than the ten login
 * attempts the production limiter allows, so leaving it on would make tests
 * fail for reasons unrelated to what they assert. Suites that want to test the
 * limits themselves can call `buildApp({ rateLimit: true })`.
 */

const request = require('supertest');

const knex = require('../../database/knex');
const { createApp } = require('../../app');

let booted = false;

// Seeded by seeds/001_admin_and_site_settings.js whenever NODE_ENV !== production.
const SEEDED_ADMIN = { username: 'admin', password: 'password' };

function buildApp(options = {}) {
  return createApp({ rateLimit: false, logging: false, ...options });
}

/**
 * Apply schema and seed data. Call from beforeAll.
 * Idempotent so a second test file in the same Jest worker can share the
 * Knex / sqlite3 singletons instead of finding them already destroyed.
 */
async function setupDatabase() {
  if (booted) return;
  await knex.migrate.latest();
  await knex.seed.run();
  booted = true;
}

/**
 * Per-file afterAll must not close Knex or the raw sqlite3 handle.
 * Jest may run another test file in the same worker. `forceExit` in
 * jest.config.js reaps the worker when the suite is done.
 */
async function teardownDatabase() {}

/**
 * Empty the tables a test writes to, without dropping the schema or the
 * seeded admin. Keeps tests independent of the order they run in.
 */
async function resetTables(...tables) {
  for (const table of tables) {
    await knex(table).del();
  }
}

/** Log in as the seeded admin and return a bearer token. */
async function loginAsAdmin(app) {
  const response = await request(app).post('/api/auth/login').send(SEEDED_ADMIN);

  if (response.status !== 200 || !response.body.token) {
    throw new Error(
      `Test harness could not log in as admin (status ${response.status}): ` +
        JSON.stringify(response.body)
    );
  }
  return response.body.token;
}

module.exports = {
  knex,
  request,
  buildApp,
  setupDatabase,
  teardownDatabase,
  resetTables,
  loginAsAdmin,
  SEEDED_ADMIN,
};
