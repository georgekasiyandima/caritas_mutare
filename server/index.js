const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

async function main() {
  const knex = require('./database/knex');
  try {
    const [, log] = await knex.migrate.latest();
    if (log.length) {
      console.log('✅ Ran migrations:', log.join(', '));
    } else {
      console.log('✅ Database migrations up to date');
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }

  // Seeds run for local development and tests. Production runs them only
  // when explicitly asked, so a mistyped NODE_ENV cannot create admin/password.
  const nodeEnv = process.env.NODE_ENV;
  const shouldRunSeeds =
    nodeEnv === 'development' ||
    nodeEnv === 'test' ||
    (nodeEnv === 'production' && process.env.RUN_SEEDS_ON_BOOT === 'true');

  if (shouldRunSeeds) {
    try {
      await knex.seed.run();
      console.log('✅ Seeds completed');
    } catch (err) {
      console.error('❌ Seed failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  Skipping seeds (production runs them only when RUN_SEEDS_ON_BOOT=true)');
  }

  const { createApp } = require('./app');
  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🛡️  Admin API:   http://localhost:${PORT}/api/system/overview`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `❌ Port ${PORT} is already in use. Stop the other API process, then restart.`
      );
      process.exit(1);
    }
    throw err;
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
