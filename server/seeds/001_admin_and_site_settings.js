/**
 * First-run seed — idempotent, safe to run on every boot.
 *
 * Behaviour in different environments:
 *   - Local development: if no admin user exists, create one using
 *     `admin / password` so we can log in without faffing. This default has
 *     been in the project since day one.
 *   - Production (NODE_ENV === 'production'): we REFUSE to insert the weak
 *     default admin. Instead, if both `BOOTSTRAP_ADMIN_USERNAME` and
 *     `BOOTSTRAP_ADMIN_PASSWORD` are provided (and no admin exists yet), we
 *     create the first admin from those values. The password is hashed on
 *     the fly so we never have to commit a hash. If those env vars are not
 *     set, we simply skip the admin insert — the operator can create the
 *     first user via a one-shot script.
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
    value_en: 'Catholic community development organization serving the Diocese of Mutare',
    value_sh: 'Sangano revaCatholic rinobatsira nharaunda muDiocese yeMutare',
    type: 'text',
  },
  { key: 'contact_email', value_en: 'info@caritasmutare.org', value_sh: 'info@caritasmutare.org', type: 'text' },
  { key: 'contact_phone', value_en: '+263 20 6XXXXXX', value_sh: '+263 20 6XXXXXX', type: 'text' },
  { key: 'address_en', value_en: 'Mutare, Zimbabwe', value_sh: 'Mutare, Zimbabwe', type: 'text' },
  { key: 'address_sh', value_en: 'Mutare, Zimbabwe', value_sh: 'Mutare, Zimbabwe', type: 'text' },
];

async function seedFirstAdmin(knex) {
  const isProduction = process.env.NODE_ENV === 'production';
  const existingAdmin = await knex('users').first();

  // Someone already exists — never touch the users table from a seed.
  if (existingAdmin) return;

  if (!isProduction) {
    await knex('users').insert(DEV_DEFAULT_ADMIN).onConflict('username').ignore();
    console.log('🌱 Seeded development admin (admin / password)');
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
