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

  // Public forms get a tighter cap than the global API limiter. 5 messages
  // per 15 minutes is enough for a real person and cheap against inbox flooding.
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: 'Too many messages from this address. Please try again in 15 minutes.',
    },
  });
  app.use('/api/contact', contactLimiter);

  // CORS
  //
  // In production we expect traffic from a small, known set of origins:
  //   - the Vercel production URL (e.g. https://caritas-mutare.vercel.app)
  //   - the eventual custom domain (https://www.caritasmutare.org)
  //   - any Vercel preview deployments we want to allow for testing
  //
  // `CLIENT_URL` can be a single origin or a comma-separated list. We also
  // optionally allow `*.vercel.app` preview URLs when `ALLOW_VERCEL_PREVIEWS`
  // is set to "true" — handy while we iterate, and easy to turn off later.
  //
  // Locally, CRA prints both localhost and a LAN address. Browsers also treat
  // 127.0.0.1 as a different origin from localhost. Rejecting those as a thrown
  // Error became a 500 on the contact form — deny must not look like a crash.
  const explicitOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

  function isLocalDevOrigin(origin) {
    try {
      const { hostname } = new URL(origin);
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return true;
      }
      if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
      if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
      if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
      return false;
    } catch (_err) {
      return false;
    }
  }

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin / server-to-server / curl requests send no Origin header
        // and should always be allowed through.
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV !== 'production' && isLocalDevOrigin(origin)) {
          return callback(null, true);
        }

        if (explicitOrigins.includes(origin)) {
          return callback(null, true);
        }

        if (allowVercelPreviews && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
          return callback(null, true);
        }

        console.warn(`Blocked by CORS: ${origin}`);
        return callback(null, false);
      },
      credentials: true,
    })
  );

  app.use(morgan('combined'));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/uploads', express.static('uploads'));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/contact', require('./routes/contact'));
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
