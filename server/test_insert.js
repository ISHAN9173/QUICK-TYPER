const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, user: 'postgres', password: 'parve', database: 'quicktype_db' });

async function check() {
  try {
    const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'test_history'");
    console.log('Columns in test_history:', cols.rows);

    const testInsert = await pool.query(
      `INSERT INTO test_history
         (user_id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars, missed_keys, duration, elapsed_secs, passage_id, typed_date)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, wpm, accuracy`,
      [1, 60, 65, 98.0, 1, 200, 205, JSON.stringify([]), 60, 60, 0, '11/19/2026']
    );
    console.log('SUCCESS INSERT:', testInsert.rows[0]);
  } catch (err) {
    console.error('ERROR OCCURRED:', err);
  } finally {
    await pool.end();
  }
}

check();
