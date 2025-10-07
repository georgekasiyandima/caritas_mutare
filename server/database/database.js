const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database.sqlite');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Users table for admin authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // News articles table
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT NULL,
      title_sh TEXT,
      content_en TEXT NOT NULL,
      content_sh TEXT,
      excerpt_en TEXT,
      excerpt_sh TEXT,
      featured_image TEXT,
      status TEXT DEFAULT 'draft',
      author_id INTEGER,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);

  // Programs table
  db.run(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT NULL,
      title_sh TEXT,
      description_en TEXT NOT NULL,
      description_sh TEXT,
      image TEXT,
      status TEXT DEFAULT 'active',
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Donations table
  db.run(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_name TEXT NOT NULL,
      donor_email TEXT,
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT DEFAULT 'USD',
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      payment_id TEXT,
      message TEXT,
      is_anonymous BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Volunteers table
  db.run(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      skills TEXT,
      availability TEXT,
      interests TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Site settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value_en TEXT,
      value_sh TEXT,
      type TEXT DEFAULT 'text',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin user (password: admin123)
  db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role)
    VALUES ('admin', 'admin@caritasmutare.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
  `);

  // Insert default site settings
  const defaultSettings = [
    ['site_title_en', 'Caritas Mutare', 'Caritas Mutare', 'text'],
    ['site_title_sh', 'Caritas Mutare', 'Caritas Mutare', 'text'],
    ['site_description_en', 'Catholic community development organization serving the Diocese of Mutare', 'Sangano revaCatholic rinobatsira nharaunda muDiocese yeMutare', 'text'],
    ['contact_email', 'info@caritasmutare.org', 'info@caritasmutare.org', 'text'],
    ['contact_phone', '+263 20 6XXXXXX', '+263 20 6XXXXXX', 'text'],
    ['address_en', 'Mutare, Zimbabwe', 'Mutare, Zimbabwe', 'text'],
    ['address_sh', 'Mutare, Zimbabwe', 'Mutare, Zimbabwe', 'text']
  ];

  const insertSettings = db.prepare(`
    INSERT OR IGNORE INTO site_settings (key, value_en, value_sh, type)
    VALUES (?, ?, ?, ?)
  `);

  defaultSettings.forEach(setting => {
    insertSettings.run(setting);
  });

  insertSettings.finalize();

  console.log('✅ Database tables initialized');
}

// Helper function to run queries with promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll
};

