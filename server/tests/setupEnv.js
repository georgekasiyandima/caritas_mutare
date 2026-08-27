/**
 * Runs before the test framework and before any module is required, so the
 * environment is already correct by the time `database/knex.js` reads it.
 *
 * Each test file gets its own temp SQLite file. Jest runs test files in
 * parallel workers, and a shared database would let one suite's rows leak into
 * another's assertions, so isolation here is what keeps the suite honest.
 */

const os = require('os');
const path = require('path');
const crypto = require('crypto');

process.env.NODE_ENV = 'test';
process.env.KNEX_ENV = 'test';

// Real value is irrelevant; what matters is that it is set, so the production
// guard in middleware/auth.js does not throw and tokens are signable.
process.env.JWT_SECRET = 'test-secret-not-used-anywhere-real';

process.env.DATABASE_PATH = path.join(
  os.tmpdir(),
  `caritas-test-${process.pid}-${crypto.randomUUID()}.sqlite`
);
