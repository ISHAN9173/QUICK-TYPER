const pool = require('./db/pool');

async function runMigration() {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_current INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_longest INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_last_date VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS practice_count INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS unlocked_badges JSONB NOT NULL DEFAULT '[]'::jsonb;

      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id VARCHAR(100) NOT NULL,
        earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, badge_id)
      );
    `);
    console.log('PostgreSQL migration completed successfully.');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
