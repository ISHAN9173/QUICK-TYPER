const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_CLIENT = (process.env.DB_CLIENT || 'mysql').toLowerCase();

let pool;

if (DB_CLIENT === 'postgres') {
  // ── PostgreSQL Connection ───────────────────────────────────────
  const { Pool } = require('pg');
  const pgPool = new Pool({
    host:     process.env.PG_HOST     || process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.PG_PORT || process.env.DB_PORT) || 5432,
    database: process.env.PG_DATABASE || process.env.DB_NAME     || 'quicktype_db',
    user:     process.env.PG_USER     || process.env.DB_USER     || 'postgres',
    password: process.env.PG_PASSWORD || process.env.DB_PASSWORD || 'admin',
    ssl: process.env.PG_HOST && !['localhost', '127.0.0.1'].includes(process.env.PG_HOST) 
         ? { rejectUnauthorized: false } 
         : false,
  });

  pgPool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
  });

  pool = pgPool;
  console.log(`[Database] Connected using PostgreSQL (${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432})`);
} else {
  // ── MySQL Connection ───────────────────────────────────────────
  const mysql = require('mysql2/promise');
  const mysqlPool = mysql.createPool({
    host:     process.env.MYSQL_HOST     || process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.MYSQL_PORT || process.env.DB_PORT) || 3306,
    user:     process.env.MYSQL_USER     || process.env.DB_USER     || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'admin',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME     || 'quicktype_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pool = {
    async query(sql, params = []) {
      // 1. Strip PostgreSQL RETURNING clause for MySQL compatibility
      let cleanSql = sql.replace(/\s+RETURNING\s+[\w\s,\*]+/i, '');

      // 2. Convert $1, $2, $3 placeholders to MySQL ?
      cleanSql = cleanSql.replace(/\$\d+/g, '?');

      const [results] = await mysqlPool.execute(cleanSql, params);

      if (Array.isArray(results)) {
        return { rows: results, rowCount: results.length };
      }
      
      const insertId = results.insertId;
      return { 
        rows: [{ id: insertId, insertId }], 
        rowCount: results.affectedRows, 
        insertId 
      };
    }
  };
  console.log(`[Database] Connected using MySQL (${process.env.MYSQL_HOST || 'localhost'}:${process.env.MYSQL_PORT || 3306})`);
}

module.exports = pool;
