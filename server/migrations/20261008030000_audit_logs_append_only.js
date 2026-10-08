/**
 * Reject UPDATE and DELETE on audit_logs.
 *
 * The table was described as append-only, but nothing enforced it: any code
 * with the database connection could change or remove a row. These triggers
 * abort those statements. They do not stop someone who can drop the trigger
 * (the database owner).
 *
 * SQLite and Postgres need different trigger syntax. Tests run on SQLite;
 * production runs on Postgres.
 */

exports.up = async function up(knex) {
  const isPg = knex.client.config.client === 'pg';

  if (isPg) {
    await knex.raw(`
      CREATE OR REPLACE FUNCTION audit_logs_reject_mutation()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RAISE EXCEPTION 'audit_logs is append-only';
      END;
      $$;
    `);
    await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_update ON audit_logs');
    await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_delete ON audit_logs');
    await knex.raw(`
      CREATE TRIGGER audit_logs_no_update
      BEFORE UPDATE ON audit_logs
      FOR EACH ROW
      EXECUTE FUNCTION audit_logs_reject_mutation();
    `);
    await knex.raw(`
      CREATE TRIGGER audit_logs_no_delete
      BEFORE DELETE ON audit_logs
      FOR EACH ROW
      EXECUTE FUNCTION audit_logs_reject_mutation();
    `);
    return;
  }

  await knex.raw(`
    CREATE TRIGGER IF NOT EXISTS audit_logs_no_update
    BEFORE UPDATE ON audit_logs
    BEGIN
      SELECT RAISE(ABORT, 'audit_logs is append-only');
    END;
  `);
  await knex.raw(`
    CREATE TRIGGER IF NOT EXISTS audit_logs_no_delete
    BEFORE DELETE ON audit_logs
    BEGIN
      SELECT RAISE(ABORT, 'audit_logs is append-only');
    END;
  `);
};

exports.down = async function down(knex) {
  const isPg = knex.client.config.client === 'pg';

  if (isPg) {
    await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_update ON audit_logs');
    await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_delete ON audit_logs');
    await knex.raw('DROP FUNCTION IF EXISTS audit_logs_reject_mutation()');
    return;
  }

  await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_update');
  await knex.raw('DROP TRIGGER IF EXISTS audit_logs_no_delete');
};
