const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'parve',
  dbName: process.env.PG_DATABASE || 'quicktype_db'
};

async function setup() {
  console.log('Connecting to PostgreSQL server...');
  
  // 1. Connect to default 'postgres' database to create quicktype_db if missing
  const rootClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    const checkDb = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [config.dbName]
    );

    if (checkDb.rowCount === 0) {
      console.log(`Creating database "${config.dbName}"...`);
      await rootClient.query(`CREATE DATABASE "${config.dbName}"`);
      console.log(`Database "${config.dbName}" created successfully!`);
    } else {
      console.log(`Database "${config.dbName}" already exists.`);
    }
  } catch (err) {
    console.warn('Note on root DB check:', err.message);
  } finally {
    try { await rootClient.end(); } catch {}
  }

  // 2. Connect to quicktype_db and apply full schema
  const dbClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.dbName
  });

  await dbClient.connect();
  console.log(`Connected to database "${config.dbName}". Applying schema tables...`);

  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await dbClient.query(sql);

  console.log('✓ All PostgreSQL schema tables created successfully!\n');

  const tables = await dbClient.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('Tables created in PostgreSQL:');
  tables.rows.forEach(r => console.log('  - ' + r.table_name));

  await dbClient.end();
  console.log('\nReady! You can now start the server and view live data changes.');
}

setup().catch(err => {
  console.error('\nDatabase setup error:', err.message);
  console.log('Check your server/.env settings (PG_USER, PG_PASSWORD, PG_PORT).');
  process.exit(1);
});
