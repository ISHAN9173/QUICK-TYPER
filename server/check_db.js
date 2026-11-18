require('dotenv').config();
const pool = require('./db/pool');

async function test() {
  try {
    const res = await pool.query('SELECT id, name, email FROM users');
    console.log('USERS IN DB:', res.rows);

    // Test inserting a real practice session
    const insertRes = await pool.query(
      `INSERT INTO practice_sessions
         (user_id, mode, wpm, accuracy, errors, correct_chars, total_chars, missed_keys, pattern_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [1, 'all', 58, 96, 2, 48, 50, JSON.stringify([{ key: 'k', count: 2 }]), 'quick brown fox']
    );
    console.log('PRACTICE INSERT SUCCESSFUL! Insert ID:', insertRes.insertId);

    const hist = await pool.query('SELECT count(*) as count FROM test_history');
    console.log('TEST HISTORY COUNT:', hist.rows[0].count);

    const prac = await pool.query('SELECT count(*) as count FROM practice_sessions');
    console.log('PRACTICE SESSIONS COUNT:', prac.rows[0].count);

    const recentPractice = await pool.query('SELECT * FROM practice_sessions ORDER BY id DESC LIMIT 1');
    console.log('LATEST SAVED PRACTICE RECORD:', recentPractice.rows[0]);
  } catch (err) {
    console.error('DB Error:', err.message);
  } finally {
    process.exit(0);
  }
}
test();
