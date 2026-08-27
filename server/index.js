require('dotenv').config();

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

  // Seeds run automatically in development (nice DX) and are opt-in for
  // production. Set RUN_SEEDS_ON_BOOT=true on Render when you want the
  // seed file to attempt to bootstrap the first admin + site settings.
  const shouldRunSeeds =
    process.env.NODE_ENV !== 'production' || process.env.RUN_SEEDS_ON_BOOT === 'true';

  if (shouldRunSeeds) {
    try {
      await knex.seed.run();
      console.log('✅ Seeds completed');
    } catch (err) {
      console.error('❌ Seed failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  Skipping seeds (set RUN_SEEDS_ON_BOOT=true to enable in production)');
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
