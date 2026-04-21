/**
 * Wave 1 admin refactor:
 *  - Adds M&E fields to beneficiaries (gender, age_group, DOB, household_size, consent).
 *  - Adds `registered_on` so reporting by registration date is not tied to created_at.
 *  - Adds an append-only `audit_logs` table capturing every admin mutation.
 *  - Backfills `registered_on` from created_at for existing rows (SQLite-safe update).
 */

async function ensureColumn(knex, table, column, builder) {
  const exists = await knex.schema.hasColumn(table, column);
  if (!exists) {
    await knex.schema.alterTable(table, (t) => builder(t));
  }
}

exports.up = async function up(knex) {
  if (await knex.schema.hasTable('system_beneficiaries')) {
    await ensureColumn(knex, 'system_beneficiaries', 'gender', (t) =>
      t.string('gender').defaultTo('unspecified')
    );
    await ensureColumn(knex, 'system_beneficiaries', 'age_group', (t) =>
      t.string('age_group').defaultTo('unspecified')
    );
    await ensureColumn(knex, 'system_beneficiaries', 'date_of_birth', (t) =>
      t.string('date_of_birth')
    );
    await ensureColumn(knex, 'system_beneficiaries', 'household_size', (t) =>
      t.integer('household_size')
    );
    await ensureColumn(knex, 'system_beneficiaries', 'consent_collected', (t) =>
      t.boolean('consent_collected').defaultTo(false)
    );
    await ensureColumn(knex, 'system_beneficiaries', 'registered_on', (t) =>
      t.string('registered_on')
    );

    await knex('system_beneficiaries')
      .whereNull('registered_on')
      .update({ registered_on: knex.raw("substr(created_at, 1, 10)") });
  }

  if (!(await knex.schema.hasTable('audit_logs'))) {
    await knex.schema.createTable('audit_logs', (table) => {
      table.increments('id').primary();
      table.integer('actor_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('actor_username');
      table.string('action').notNullable(); // create | update | delete | login | logout | export
      table.string('entity').notNullable(); // projects | beneficiaries | activity_logs | soup_kitchen_logs | auth
      table.integer('entity_id'); // nullable for auth events
      table.text('before_json'); // serialized snapshot prior to change (null on create/login)
      table.text('after_json'); // serialized snapshot post change (null on delete/logout)
      table.text('metadata_json'); // IP, user agent, export filters, etc.
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
    await knex.raw('CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id)');
    await knex.raw('CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id)');
    await knex.raw('CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)');
  }
};

exports.down = async function down(knex) {
  if (await knex.schema.hasTable('audit_logs')) {
    await knex.schema.dropTable('audit_logs');
  }
  // NOTE: beneficiary columns are left in place on rollback — SQLite cannot
  // drop columns easily and the extra columns are harmless.
};
