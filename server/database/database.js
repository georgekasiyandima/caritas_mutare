/**
 * Compatibility shim for the legacy `dbGet / dbRun / dbAll` helpers used
 * throughout the routes. Historically these were thin wrappers around the raw
 * `sqlite3` driver; that made the codebase SQLite-only and would crash the
 * moment we pointed it at a managed Postgres database in production.
 *
 * This module now exposes the same three helpers but chooses the right
 * implementation at boot-time based on the Knex client configured in
 * `knexfile.js`:
 *
 *   - **SQLite** (local dev / tests): we keep the native `sqlite3` driver for
 *     speed and because it exposes `lastID` naturally via `this.lastID`.
 *   - **Postgres** (production on Neon / any managed Postgres): we route every
 *     query through `knex.raw(sql, params)`. Knex converts positional `?`
 *     bindings into the `$1, $2, ...` form Postgres expects, so the SQL
 *     scattered across `routes/*.js` keeps working unchanged.
 *
 * The one place the two dialects disagree is the id of a freshly-inserted
 * row. SQLite surfaces it as `this.lastID` on the statement callback; Postgres
 * requires `RETURNING id` on the INSERT and then reads `result.rows[0].id`.
 * The Postgres implementation below auto-appends `RETURNING id` to any plain
 * INSERT so callers can continue to rely on `{ id, changes }` being present
 * in the return value.
 */

const path = require('path');
const fs = require('fs');

const knex = require('./knex');
const dialect = knex.client.config.client;
const isPg = dialect === 'pg';

// Always ensure the uploads directory exists. On ephemeral filesystems (e.g.
// Render free tier) the directory will get re-created on every deploy; files
// inside it won't survive. That's a known limitation documented in the
// deployment runbook — we'll swap to Cloudflare R2 before heavy use.
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function buildSqliteAdapter() {
  // eslint-disable-next-line global-require
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database.sqlite');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('✅ Connected to SQLite database');
      console.log('   (Schema is managed by Knex migrations — see server/knexfile.js)');
    }
  });

  const dbRun = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function runCallback(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });

  const dbGet = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

  const dbAll = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

  return { db, dbRun, dbGet, dbAll };
}

function buildPostgresAdapter() {
  console.log('✅ Connected to PostgreSQL (via Knex raw)');

  const INSERT_RE = /^\s*INSERT\s+INTO\b/i;
  const HAS_RETURNING_RE = /\bRETURNING\b/i;

  const dbRun = async (sql, params = []) => {
    let finalSql = sql;
    if (INSERT_RE.test(sql) && !HAS_RETURNING_RE.test(sql)) {
      finalSql = `${sql.trimEnd()} RETURNING id`;
    }
    const result = await knex.raw(finalSql, params);
    const firstRow = Array.isArray(result?.rows) ? result.rows[0] : undefined;
    return {
      id: firstRow ? firstRow.id : undefined,
      changes: typeof result?.rowCount === 'number' ? result.rowCount : 0,
    };
  };

  const dbGet = async (sql, params = []) => {
    const result = await knex.raw(sql, params);
    const rows = Array.isArray(result?.rows) ? result.rows : [];
    return rows[0];
  };

  const dbAll = async (sql, params = []) => {
    const result = await knex.raw(sql, params);
    return Array.isArray(result?.rows) ? result.rows : [];
  };

  return { db: null, dbRun, dbGet, dbAll };
}

module.exports = isPg ? buildPostgresAdapter() : buildSqliteAdapter();
