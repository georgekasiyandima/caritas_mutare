/**
 * First-run seed — idempotent, safe to run on every boot.
 *
 * Behaviour in different environments:
 *   - Local development and tests (NODE_ENV is exactly development or test):
 *     if no admin user exists, create one using admin / password.
 *   - Every other value, including production and an unset NODE_ENV: never
 *     insert that weak password. In production, if BOOTSTRAP_ADMIN_USERNAME
 *     and BOOTSTRAP_ADMIN_PASSWORD are set and no user exists yet, create
 *     the first admin from those values.
 *
 * The site-settings seed is safe for all environments and runs unchanged.
 */

const bcrypt = require('bcryptjs');

const DEV_DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@caritasmutare.org',
  // bcrypt hash of "password" — only used in local development.
  password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  role: 'admin',
};

const DEFAULT_SETTINGS = [
  { key: 'site_title_en', value_en: 'Caritas Mutare', value_sh: 'Caritas Mutare', type: 'text' },
  { key: 'site_title_sh', value_en: 'Caritas Mutare', value_sh: 'Caritas Mutare', type: 'text' },
  {
    key: 'site_description_en',
    value_en: 'Development arm of the Catholic Church and humanitarian response — serving the Diocese of Mutare.',
    value_sh: 'Ruoko rwekusimudzira rweChechi yeCatholic uye mhinduro yerubatsiro rwekukurumidza — tichibatsira Diocese yeMutare.',
    type: 'text',
  },
  { key: 'contact_email', value_en: 'info@caritasmutare.org', value_sh: 'info@caritasmutare.org', type: 'text' },
  { key: 'contact_phone', value_en: '+263 20 6XXXXXX', value_sh: '+263 20 6XXXXXX', type: 'text' },
  { key: 'address_en', value_en: 'Mutare, Zimbabwe', value_sh: 'Mutare, Zimbabwe', type: 'text' },
  { key: 'address_sh', value_en: 'Mutare, Zimbabwe', value_sh: 'Mutare, Zimbabwe', type: 'text' },
];

async function seedFirstAdmin(knex) {
  const nodeEnv = process.env.NODE_ENV;
  const allowDevAdmin = nodeEnv === 'development' || nodeEnv === 'test';
  const existingAdmin = await knex('users').first();

  // Someone already exists — never touch the users table from a seed.
  if (existingAdmin) return;

  if (allowDevAdmin) {
    await knex('users').insert(DEV_DEFAULT_ADMIN).onConflict('username').ignore();
    console.log('🌱 Seeded development admin (admin / password)');
    return;
  }

  if (nodeEnv !== 'production') {
    console.warn('⚠️  Skipping admin seed: NODE_ENV must be development, test, or production.');
    return;
  }

  const bootstrapUsername = process.env.BOOTSTRAP_ADMIN_USERNAME;
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@caritasmutare.org';
  const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!bootstrapUsername || !bootstrapPassword) {
    console.warn(
      '⚠️  No admin user exists and BOOTSTRAP_ADMIN_USERNAME / BOOTSTRAP_ADMIN_PASSWORD are not set. ' +
        'Skipping admin bootstrap — create one via the admin-creation script before go-live.'
    );
    return;
  }

  const password_hash = await bcrypt.hash(bootstrapPassword, 10);
  await knex('users')
    .insert({
      username: bootstrapUsername,
      email: bootstrapEmail,
      password_hash,
      role: 'admin',
    })
    .onConflict('username')
    .ignore();
  console.log(`🌱 Bootstrapped production admin: ${bootstrapUsername}`);
}

exports.seed = async function seed(knex) {
  await seedFirstAdmin(knex);

  for (const row of DEFAULT_SETTINGS) {
    await knex('site_settings').insert(row).onConflict('key').ignore();
  }
};
