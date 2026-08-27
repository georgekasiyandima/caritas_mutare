module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  // The routes log to console on error paths, which we exercise deliberately.
  // Keeping output quiet makes real failures easy to spot.
  silent: true,
  // SQLite file setup per suite costs a second or two; the default 5s timeout
  // is tight once migrations run.
  testTimeout: 20000,
  clearMocks: true,
  // sqlite3 and the Knex pool keep the event loop alive. Closing them in
  // afterAll would break a second test file in the same worker (both share
  // the module singleton). Force-exit once assertions have finished.
  forceExit: true,
};
