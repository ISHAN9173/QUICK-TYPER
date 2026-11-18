// view_db.js - Quick terminal viewer for PostgreSQL data
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  host:     process.env.PG_HOST || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'quicktype_db',
  user:     process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'parve',
});

async function run() {
  console.log('\n======================================================');
  console.log('       QuickType PostgreSQL Live Data Viewer');
  console.log('======================================================\n');

  try {
    // 1. Users
    const users = await pool.query('SELECT id, name, email, theme, goal_wpm, total_tests, total_chars_typed, created_at FROM users');
    console.log(`👥 USERS TABLE (${users.rowCount} records):`);
    console.table(users.rows);

    // 2. Test History
    const history = await pool.query('SELECT id, user_id, wpm, raw_wpm, accuracy, errors, correct_chars, duration, typed_date, created_at FROM test_history ORDER BY id DESC LIMIT 10');
    console.log(`\n📈 TEST HISTORY TABLE (${history.rowCount} records):`);
    console.table(history.rows);

    // 3. Practice Sessions
    const practice = await pool.query('SELECT id, user_id, mode, wpm, accuracy, errors, correct_chars, pattern_used, created_at FROM practice_sessions ORDER BY id DESC LIMIT 10');
    console.log(`\n⌨️  PRACTICE SESSIONS TABLE (${practice.rowCount} records):`);
    console.table(practice.rows);

    // 4. Feedback
    const feedback = await pool.query('SELECT id, user_id, name, email, rating, category, message, created_at FROM feedback ORDER BY id DESC LIMIT 10');
    console.log(`\n💬 FEEDBACK TABLE (${feedback.rowCount} records):`);
    console.table(feedback.rows);

    console.log('\n======================================================\n');
  } catch (err) {
    console.error('Database Query Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
