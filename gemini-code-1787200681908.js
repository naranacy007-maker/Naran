import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pos_store.db');

export const initDatabase = () => {
  try {
    // 1. Products Table (ဆိုင်ကယ်အပိုပစ္စည်းများ)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        cost_price REAL DEFAULT 0,
        selling_price REAL DEFAULT 0,
        stock_qty INTEGER DEFAULT 0
      );
    `);

    // 2. Sales Table (အရောင်းဘောက်ချာ)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voucher_no TEXT UNIQUE,
        total_amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Sale Items Table (ဘောက်ချာအသေးစိတ်)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER,
        product_id INTEGER,
        qty INTEGER,
        unit_price REAL,
        subtotal REAL,
        FOREIGN KEY(sale_id) REFERENCES sales(id)
      );
    `);

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

export default db;