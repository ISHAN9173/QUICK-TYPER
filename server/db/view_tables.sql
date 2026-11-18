-- ============================================================
--  QuickType — Database View Queries (Clean)
--  Run these in pgAdmin Query Tool or psql
--  Connect to: quicktype_db
-- ============================================================

-- 1. SHOW ALL TABLES IN THE DATABASE
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. SHOW TABLE STRUCTURES
-- users table structure
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- test_history table structure
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_history'
ORDER BY ordinal_position;

-- feedback table structure
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'feedback'
ORDER BY ordinal_position;

-- 3. VIEW ALL DATA IN EACH TABLE
-- All users (passwords hidden)
SELECT id, name, email, theme, goal_wpm,
       streak_current, streak_longest, streak_last_date,
       practice_count, unlocked_badges, created_at
FROM users
ORDER BY id;

-- All test results
SELECT th.id, u.name AS user_name, th.wpm, th.accuracy,
       th.errors, th.duration, th.typed_date, th.created_at
FROM test_history th
JOIN users u ON u.id = th.user_id
ORDER BY th.created_at DESC;

-- All feedback submissions
SELECT id, name, email, message, created_at
FROM feedback
ORDER BY created_at DESC;

-- 4. ROW COUNTS
SELECT 'users'        AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'test_history',COUNT(*) FROM test_history
UNION ALL
SELECT 'feedback',    COUNT(*) FROM feedback;
