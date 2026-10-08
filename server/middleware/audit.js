/**
 * Audit trail for staff actions.
 *
 * Usage from a route handler (after the change has succeeded):
 *   await writeAudit(req, { action: 'update', entity: 'projects', entityId: id, before, after });
 *
 * Rows are insert-only. A database trigger rejects UPDATE and DELETE
 * (see the audit_logs_append_only migration). The application user can
 * still drop that trigger if they have the database password — the
 * trigger stops accidental or buggy edits, not a person who owns the database.
 */

const knex = require('../database/knex');

const MAX_SNAPSHOT_BYTES = 16 * 1024;

function safeSnapshot(value) {
  if (value === undefined || value === null) return null;
  try {
    const json = JSON.stringify(value);
    if (json.length > MAX_SNAPSHOT_BYTES) {
      return JSON.stringify({ truncated: true, size: json.length });
    }
    return json;
  } catch (_err) {
    return JSON.stringify({ error: 'snapshot_failed' });
  }
}

/**
 * Client address after Express has applied `trust proxy`.
 *
 * Do not read X-Forwarded-For here. The browser can put any address at the
 * front of that header. With `trust proxy` set to 1, req.ip is the address
 * the one trusted hop (Render) appended, not the value the visitor invented.
 */
function clientAddress(req) {
  if (!req) return null;
  if (req.ip) return req.ip;
  return req.socket?.remoteAddress || req.connection?.remoteAddress || null;
}

function buildMetadata(req, extra = {}) {
  const headers = req.headers || {};
  return {
    ip: clientAddress(req),
    userAgent: headers['user-agent'] || null,
    method: req.method || null,
    path: req.originalUrl || null,
    ...extra,
  };
}

async function writeAudit(
  req,
  { action, entity, entityId = null, before = null, after = null, metadata = {}, actor }
) {
  // `actor` lets callers (e.g. login route) record a user that isn't on req.user yet.
  const actingUser = actor || req?.user || null;
  try {
    await knex('audit_logs').insert({
      actor_id: actingUser?.id || null,
      actor_username: actingUser?.username || null,
      action,
      entity,
      entity_id: entityId,
      before_json: safeSnapshot(before),
      after_json: safeSnapshot(after),
      metadata_json: safeSnapshot(buildMetadata(req || {}, metadata)),
    });
  } catch (err) {
    // Never let audit failures take down the user-facing request.
    console.error('[audit] failed to write log:', err.message);
  }
}

module.exports = { writeAudit };
