/**
 * Donate-page Wave B:
 *  - Adds frequency (one_time | monthly) so monthly giving intent is captured.
 *  - Adds designation (project slug or 'most_needed') so donors can earmark
 *    a programme.
 *  - Adds donor_phone so the donations table matches what the public form
 *    already collects.
 *  - Adds source so we can later see where pledges came from (web, sticky bar, etc.).
 *
 * No data backfill — existing rows simply get the column defaults.
 */

async function ensureColumn(knex, table, column, builder) {
  const exists = await knex.schema.hasColumn(table, column);
  if (!exists) {
    await knex.schema.alterTable(table, (t) => builder(t));
  }
}

exports.up = async function up(knex) {
  if (!(await knex.schema.hasTable('donations'))) return;

  await ensureColumn(knex, 'donations', 'frequency', (t) =>
    t.string('frequency').defaultTo('one_time')
  );
  await ensureColumn(knex, 'donations', 'designation', (t) =>
    t.string('designation').defaultTo('most_needed')
  );
  await ensureColumn(knex, 'donations', 'donor_phone', (t) => t.string('donor_phone'));
  await ensureColumn(knex, 'donations', 'source', (t) =>
    t.string('source').defaultTo('web_donate_page')
  );
};

exports.down = async function down(knex) {
  if (!(await knex.schema.hasTable('donations'))) return;

  /*
   * SQLite supports DROP COLUMN since 3.35 (2021). knex's dropColumn relies on
   * the underlying engine; if running on something older this will throw and
   * the migration has to be rolled back manually. Acceptable for our deployment.
   */
  for (const col of ['source', 'donor_phone', 'designation', 'frequency']) {
    if (await knex.schema.hasColumn('donations', col)) {
      await knex.schema.alterTable('donations', (t) => t.dropColumn(col));
    }
  }
};
