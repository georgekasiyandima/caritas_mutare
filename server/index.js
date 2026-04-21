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

  try {
    await knex.seed.run();
    console.log('✅ Seeds completed');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }

  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const compression = require('compression');
  const rateLimit = require('express-rate-limit');

  const app = express();

  // Trust the first reverse-proxy hop (nginx / Render / Vercel). Required so
  // express-rate-limit and our audit log can read the real client IP in prod.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again in 15 minutes.',
  });
  app.use('/api/auth/login', loginLimiter);

  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(morgan('combined'));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/uploads', express.static('uploads'));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/content', require('./routes/content'));
  app.use('/api/donations', require('./routes/donations'));
  app.use('/api/volunteers', require('./routes/volunteers'));
  app.use('/api/news', require('./routes/news'));
  app.use('/api/system', require('./routes/system'));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : {},
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  module.exports = app;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🛡️  Admin API:   http://localhost:${PORT}/api/system/overview`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
