/**
 * Remove "9. " prefix from Day of the Poor article title in the database.
 * Run from server directory: node scripts/fix-day-of-poor-title.js
 */
const { dbRun, dbAll } = require('../database/database');

async function fix() {
  try {
    const rows = await dbAll(
      "SELECT id, title_en FROM news WHERE title_en LIKE '9.%' AND title_en LIKE '%Day of the Poor%'"
    );
    if (rows.length === 0) {
      console.log('No matching article found. Nothing to update.');
      process.exit(0);
      return;
    }
    for (const row of rows) {
      await dbRun(
        'UPDATE news SET title_en = ?, title_sh = ? WHERE id = ?',
        ['Caritas Mutare Day of the Poor', 'Caritas Mutare Day of the Poor', row.id]
      );
      console.log('Updated article id', row.id, ':', row.title_en, '-> Caritas Mutare Day of the Poor');
    }
    console.log('Done.');
  } catch (err) {
    console.error('Fix failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

fix();
