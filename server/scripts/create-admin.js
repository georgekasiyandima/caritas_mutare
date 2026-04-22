/**
 * Create or reset a single admin user on any environment.
 *
 * Usage:
 *   node scripts/create-admin.js <username> <email> <password>
 *
 * - If the username already exists, the script updates the password/email.
 * - If it doesn't exist, the script inserts a new admin.
 *
 * Intended for use on Render via `render exec` (or locally for quick resets).
 * Never commit real credentials — pass them on the command line at run time.
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const knex = require('../database/knex');

async function main() {
  const [, , usernameArg, emailArg, passwordArg] = process.argv;

  if (!usernameArg || !emailArg || !passwordArg) {
    console.error('Usage: node scripts/create-admin.js <username> <email> <password>');
    process.exit(1);
  }

  if (passwordArg.length < 10) {
    console.error('❌ Refusing to create/reset admin with a password shorter than 10 characters.');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(passwordArg, 10);
  const existing = await knex('users').where({ username: usernameArg }).first();

  if (existing) {
    await knex('users')
      .where({ id: existing.id })
      .update({ email: emailArg, password_hash, role: 'admin', updated_at: knex.fn.now() });
    console.log(`♻️  Updated existing admin: ${usernameArg} (${emailArg})`);
  } else {
    await knex('users').insert({
      username: usernameArg,
      email: emailArg,
      password_hash,
      role: 'admin',
    });
    console.log(`✅ Created new admin: ${usernameArg} (${emailArg})`);
  }

  await knex.destroy();
}

main().catch((err) => {
  console.error('❌ create-admin failed:', err.message);
  process.exit(1);
});
