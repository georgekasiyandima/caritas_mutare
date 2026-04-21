/**
 * Append-only audit trail for admin mutations.
 *
 * Usage from a route handler (after the change has succeeded):
 *   await writeAudit(req, { action: 'update', entity: 'projects', entityId: id, before, after });
 *
 * The table is append-only by convention — never expose UPDATE/DELETE on it.
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

function buildMetadata(req, extra = {}) {
  const headers = req.headers || {};
  return {
    ip:
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      null,
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
