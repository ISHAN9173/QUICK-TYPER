const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, user: 'postgres', password: 'parve', database: 'quicktype_db' });

async function check() {
  const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
  console.log('Columns in users:', cols.rows.map(r => r.column_name));
  await pool.end();
}
check();
