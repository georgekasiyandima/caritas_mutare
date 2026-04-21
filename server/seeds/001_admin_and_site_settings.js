/**
 * Idempotent defaults — safe to run multiple times (matches legacy database.js seed).
 * Default admin password hash corresponds to: password
 */

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@caritasmutare.org',
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

exports.seed = async function seed(knex) {
  await knex('users').insert(DEFAULT_ADMIN).onConflict('username').ignore();

  for (const row of DEFAULT_SETTINGS) {
    await knex('site_settings').insert(row).onConflict('key').ignore();
  }
};

