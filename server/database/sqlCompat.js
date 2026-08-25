/**
 * Helpers for writing raw SQL that runs on both SQLite (local/dev) and
 * Postgres (production on Neon).
 *
 * The `dbGet / dbRun / dbAll` shim in `database.js` handles parameter binding
 * across both dialects, but it cannot rewrite SQL that is dialect-specific in
 * its own right. Two things bit us:
 *
 *   - `datetime('now', '-30 days')` and `strftime()` are SQLite-only builtins.
 *   - Double-quoted literals such as `status = "published"` are read by
 *     Postgres as *column identifiers*, so the query fails rather than
 *     comparing against a string. Always single-quote SQL literals.
 *
 * Date cutoffs are therefore computed in JavaScript and passed as bound
 * parameters. They are formatted as 'YYYY-MM-DD HH:MM:SS' in UTC, which
 * matches how SQLite stores `CURRENT_TIMESTAMP` (so the text comparison sorts
 * correctly) and is parsed as a timestamp by Postgres.
 */

const knex = require('./knex');

const isPg = knex.client.config.client === 'pg';

/** Format a Date as 'YYYY-MM-DD HH:MM:SS' (UTC) — comparable in both dialects. */
function toSqlTimestamp(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/** Cutoff timestamp N days in the past, ready to bind as a query parameter. */
function daysAgo(days) {
  return toSqlTimestamp(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
}

/** Cutoff timestamp N months in the past, ready to bind as a query parameter. */
function monthsAgo(months) {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - months);
  return toSqlTimestamp(date);
}

/**
 * Dialect-appropriate SQL expression rendering a timestamp column as 'YYYY-MM'.
 * The column name is interpolated, so never pass user input here.
 */
function monthBucket(column) {
  return isPg ? `to_char(${column}, 'YYYY-MM')` : `strftime('%Y-%m', ${column})`;
}

module.exports = { isPg, toSqlTimestamp, daysAgo, monthsAgo, monthBucket };
