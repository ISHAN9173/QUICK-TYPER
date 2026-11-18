-- ====================================================================
--  QuickType Typing Website — Clean PostgreSQL Schema
--
--  3 TABLES ONLY:
--  1. users             -> Login, Signup, Account Profile
--  2. test_history      -> Typing test results (WPM, Accuracy, Misses, etc.)
--  3. practice_sessions -> Keyboard drill sessions per mode
--  4. feedback          -> User feedback messages and ratings
--
--  HOW TO RUN IN PGADMIN:
--  1. Open pgAdmin 4
--  2. Right-click Databases -> Create -> Database -> quicktype_db
--  3. Click quicktype_db -> Open Query Tool
--  4. Paste this file -> Press F5
-- ====================================================================

DROP VIEW  IF EXISTS user_stats;
DROP TABLE IF EXISTS feedback          CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS test_history      CASCADE;
DROP TABLE IF EXISTS users             CASCADE;


-- ====================================================================
-- TABLE 1: users
-- ====================================================================
CREATE TABLE users (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,

  theme             VARCHAR(30)  NOT NULL DEFAULT 'indigo',
  goal_wpm          INTEGER      NOT NULL DEFAULT 40,

  total_tests       INTEGER      NOT NULL DEFAULT 0,
  total_chars_typed BIGINT       NOT NULL DEFAULT 0,

  streak_current    INTEGER      NOT NULL DEFAULT 0,
  streak_longest    INTEGER      NOT NULL DEFAULT 0,
  streak_last_date  VARCHAR(50),
  practice_count    INTEGER      NOT NULL DEFAULT 0,
  unlocked_badges   JSONB        NOT NULL DEFAULT '[]'::jsonb,

  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_active_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE user_badges (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id   VARCHAR(100) NOT NULL,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);


-- ====================================================================
-- TABLE 2: test_history
-- ====================================================================
CREATE TABLE test_history (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  wpm           INTEGER       NOT NULL DEFAULT 0,
  raw_wpm       INTEGER       NOT NULL DEFAULT 0,
  accuracy      NUMERIC(5,2)  NOT NULL DEFAULT 0.00,
  errors        INTEGER       NOT NULL DEFAULT 0,
  correct_chars INTEGER       NOT NULL DEFAULT 0,
  total_chars   INTEGER       NOT NULL DEFAULT 0,

  missed_keys   JSONB                  DEFAULT '[]'::jsonb,

  duration      INTEGER       NOT NULL DEFAULT 60,
  elapsed_secs  INTEGER       NOT NULL DEFAULT 60,
  passage_id    INTEGER       NOT NULL DEFAULT 0,
  typed_date    VARCHAR(50)            DEFAULT NULL,

  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_accuracy CHECK (accuracy >= 0.00 AND accuracy <= 100.00),
  CONSTRAINT chk_wpm      CHECK (wpm >= 0),
  CONSTRAINT chk_errors   CHECK (errors >= 0)
);

CREATE INDEX idx_test_user_date ON test_history(user_id, created_at DESC);
CREATE INDEX idx_test_user_wpm  ON test_history(user_id, wpm DESC);


-- ====================================================================
-- TABLE 3: feedback
-- ====================================================================
CREATE TABLE feedback (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  rating      SMALLINT     NOT NULL DEFAULT 5,
  category    VARCHAR(50)  NOT NULL DEFAULT 'General',
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_feedback_date ON feedback(created_at DESC);


-- ====================================================================
-- TABLE 4: practice_sessions
-- Handles: Every keyboard drill session from PracticePage.jsx
-- Modes: all | left | right | home | top | bottom | numbers | numpad | shift | symbols | mixed | speed
-- ====================================================================
CREATE TABLE practice_sessions (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  mode          VARCHAR(30)   NOT NULL DEFAULT 'all',

  wpm           INTEGER       NOT NULL DEFAULT 0,
  accuracy      NUMERIC(5,2)  NOT NULL DEFAULT 0.00,
  errors        INTEGER       NOT NULL DEFAULT 0,
  correct_chars INTEGER       NOT NULL DEFAULT 0,
  total_chars   INTEGER       NOT NULL DEFAULT 0,

  missed_keys   JSONB                  DEFAULT '[]'::jsonb,
  pattern_used  TEXT                   DEFAULT NULL,

  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_practice_user_date ON practice_sessions(user_id, created_at DESC);
CREATE INDEX idx_practice_user_mode ON practice_sessions(user_id, mode);


-- ====================================================================
-- VIEW: user_stats
-- ====================================================================
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.name,
  u.email,
  u.goal_wpm,
  u.total_tests,
  u.total_chars_typed,
  COALESCE(MAX(th.wpm),               0)     AS best_wpm,
  COALESCE(MAX(th.raw_wpm),           0)     AS best_raw_wpm,
  COALESCE(MAX(th.accuracy),          0.00)  AS best_accuracy,
  COALESCE(ROUND(AVG(th.wpm)::numeric,  1), 0.0)    AS avg_wpm,
  COALESCE(ROUND(AVG(th.accuracy)::numeric, 2), 0.00) AS avg_accuracy,
  COALESCE(SUM(th.errors),            0)     AS total_errors
FROM users u
LEFT JOIN test_history th ON th.user_id = u.id
GROUP BY u.id, u.name, u.email, u.goal_wpm, u.total_tests, u.total_chars_typed;


-- ====================================================================
-- SEED DATA
-- Login: admin@gmail.com / Password: 12345
-- ====================================================================
INSERT INTO users (name, email, password_hash, theme, goal_wpm, total_tests, total_chars_typed)
VALUES (
  'Admin',
  'admin@gmail.com',
  '$2b$10$VDtXLc0IrCYu8r4Bs3sZjuKQzxzYQscT3ZazbYiJR2Ilhx/EbnD7m',
  'indigo',
  50,
  1,
  185
);

INSERT INTO test_history (
  user_id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars,
  missed_keys, duration, elapsed_secs, passage_id, typed_date
) VALUES (
  1, 58, 62, 96.75, 6, 179, 185,
  '[{"key":"e","count":3},{"key":"t","count":2},{"key":"o","count":1}]'::jsonb,
  60, 60, 1, TO_CHAR(NOW(), 'MM/DD/YYYY')
);

INSERT INTO feedback (user_id, name, email, rating, category, message)
VALUES (1, 'Admin', 'admin@gmail.com', 5, 'General', 'QuickType is fast, smooth and accurate!');
