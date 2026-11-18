const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function apply() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'parve',
    database: 'quicktype_db'
  });

  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  await client.query(sql);
  console.log('PostgreSQL schema applied successfully!');

  const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:', tables.rows.map(r => r.table_name));

  const users = await client.query('SELECT id, name, email, goal_wpm FROM users');
  console.log('Users in PostgreSQL:', users.rows);

  const tests = await client.query('SELECT id, wpm, accuracy, correct_chars, typed_date FROM test_history');
  console.log('Test history in PostgreSQL:', tests.rows);

  await client.end();
}

apply().catch(err => {
  console.error('Failed to apply schema:', err);
  process.exit(1);
});
