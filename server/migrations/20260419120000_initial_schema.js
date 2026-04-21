/**
 * Baseline schema — safe on existing SQLite files (skips tables that already exist).
 * Compatible with SQLite today and PostgreSQL when client is `pg`.
 */

exports.up = async function up(knex) {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('role').defaultTo('admin');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('news'))) {
    await knex.schema.createTable('news', (table) => {
      table.increments('id').primary();
      table.text('title_en').notNullable();
      table.text('title_sh');
      table.text('content_en').notNullable();
      table.text('content_sh');
      table.text('excerpt_en');
      table.text('excerpt_sh');
      table.text('featured_image');
      table.text('gallery');
      table.string('status').defaultTo('draft');
      table.integer('author_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('published_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  } else if (!(await knex.schema.hasColumn('news', 'gallery'))) {
    await knex.schema.alterTable('news', (table) => {
      table.text('gallery');
    });
  }

  if (!(await knex.schema.hasTable('programs'))) {
    await knex.schema.createTable('programs', (table) => {
      table.increments('id').primary();
      table.text('title_en').notNullable();
      table.text('title_sh');
      table.text('description_en').notNullable();
      table.text('description_sh');
      table.text('image');
      table.string('status').defaultTo('active');
      table.integer('order_index').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('donations'))) {
    await knex.schema.createTable('donations', (table) => {
      table.increments('id').primary();
      table.string('donor_name').notNullable();
      table.string('donor_email');
      table.decimal('amount', 10, 2).notNullable();
      table.string('currency').defaultTo('USD');
      table.string('payment_method');
      table.string('payment_status').defaultTo('pending');
      table.string('payment_id');
      table.text('message');
      table.boolean('is_anonymous').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('volunteers'))) {
    await knex.schema.createTable('volunteers', (table) => {
      table.increments('id').primary();
      table.string('full_name').notNullable();
      table.string('email').notNullable();
      table.text('phone');
      table.text('skills');
      table.text('availability');
      table.text('interests');
      table.text('message');
      table.string('status').defaultTo('pending');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('contact_messages'))) {
    await knex.schema.createTable('contact_messages', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('subject').notNullable();
      table.text('message').notNullable();
      table.string('status').defaultTo('unread');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('site_settings'))) {
    await knex.schema.createTable('site_settings', (table) => {
      table.increments('id').primary();
      table.string('key').notNullable().unique();
      table.text('value_en');
      table.text('value_sh');
      table.string('type').defaultTo('text');
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('system_projects'))) {
    await knex.schema.createTable('system_projects', (table) => {
      table.increments('id').primary();
      table.string('code').unique();
      table.string('name').notNullable();
      table.string('thematic_area').notNullable();
      table.text('donor');
      table.text('district');
      table.text('ward');
      table.text('start_date');
      table.text('end_date');
      table.string('status').defaultTo('planning');
      table.text('notes');
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('system_beneficiaries'))) {
    await knex.schema.createTable('system_beneficiaries', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('system_projects').onDelete('SET NULL');
      table.string('beneficiary_type').defaultTo('individual');
      table.string('full_name').notNullable();
      table.text('household_name');
      table.text('phone');
      table.text('district');
      table.text('ward');
      table.text('village');
      table.string('disability_inclusion').defaultTo('not_specified');
      table.text('vulnerability_tags');
      table.text('notes');
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('system_activity_logs'))) {
    await knex.schema.createTable('system_activity_logs', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().notNullable().references('id').inTable('system_projects').onDelete('CASCADE');
      table.string('activity_date').notNullable();
      table.string('activity_title').notNullable();
      table.integer('output_count').defaultTo(0);
      table.text('notes');
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('system_soup_kitchen_logs'))) {
    await knex.schema.createTable('system_soup_kitchen_logs', (table) => {
      table.increments('id').primary();
      table.string('service_date').notNullable();
      table.text('location');
      table.integer('meals_served').defaultTo(0);
      table.integer('beneficiary_count').defaultTo(0);
      table.integer('volunteer_count').defaultTo(0);
      table.text('stock_notes');
      table.text('notes');
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable('system_documents'))) {
    await knex.schema.createTable('system_documents', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('system_projects').onDelete('SET NULL');
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.string('file_path').notNullable();
      table.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_system_projects_status ON system_projects(status)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_beneficiaries_project ON system_beneficiaries(project_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON system_activity_logs(project_id)');
};

exports.down = async function down(knex) {
  const tables = [
    'system_documents',
    'system_soup_kitchen_logs',
    'system_activity_logs',
    'system_beneficiaries',
    'system_projects',
    'site_settings',
    'contact_messages',
    'volunteers',
    'donations',
    'programs',
    'news',
    'users',
  ];
  for (const name of tables) {
    if (await knex.schema.hasTable(name)) {
      await knex.schema.dropTable(name);
    }
  }
};
