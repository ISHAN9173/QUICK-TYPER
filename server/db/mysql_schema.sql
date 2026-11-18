-- ====================================================================
--  QuickType Typing Website — Clean MySQL Database Schema
--
--  3 TABLES ONLY (No badges, no streaks, no practice sessions):
--  1. users             -> Login, Signup, Account Profile
--  2. test_history      -> Typing test results (WPM, Accuracy, Misses, etc.)
--  3. practice_sessions -> Keyboard drill sessions per mode
--  4. feedback          -> User feedback messages and ratings
-- ====================================================================

-- Safe reset
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS quicktype_db;
CREATE DATABASE quicktype_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE quicktype_db;
SET FOREIGN_KEY_CHECKS = 1;


-- ====================================================================
-- TABLE 1: users
-- Handles: Create Account, Login, Profile settings
-- ====================================================================
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Login & Identity
  name          VARCHAR(100) NOT NULL          COMMENT 'User display name',
  email         VARCHAR(255) NOT NULL UNIQUE   COMMENT 'Login email (must be unique)',
  password_hash VARCHAR(255) NOT NULL          COMMENT 'bcrypt encrypted password',

  -- Profile Settings
  theme         VARCHAR(30)  NOT NULL DEFAULT 'indigo'  COMMENT 'UI theme: indigo | cyan | pink | green | amber',
  goal_wpm      SMALLINT     NOT NULL DEFAULT 40        COMMENT 'Personal WPM target set by user',

  -- Lifetime Test Counters (auto-updated after each test)
  total_tests       INT UNSIGNED NOT NULL DEFAULT 0   COMMENT 'Total typing tests completed',
  total_chars_typed BIGINT       NOT NULL DEFAULT 0   COMMENT 'Lifetime total characters typed',

  -- Timestamps
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP              COMMENT 'Account creation date & time',
  last_active_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP                    COMMENT 'Last login / activity time',

  INDEX idx_email (email)
) ENGINE=InnoDB COMMENT='User accounts — login, signup, and profile data';


-- ====================================================================
-- TABLE 2: test_history
-- Handles: Every completed typing test result
-- All values are calculated live in ActiveTestPage.jsx and saved here
-- ====================================================================
CREATE TABLE test_history (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL       COMMENT 'Linked user (references users.id)',

  -- Typing Speed
  wpm           SMALLINT UNSIGNED NOT NULL DEFAULT 0     COMMENT 'Net WPM = (correct_chars / 5) / (elapsed_secs / 60)',
  raw_wpm       SMALLINT UNSIGNED NOT NULL DEFAULT 0     COMMENT 'Raw WPM = (total_chars / 5) / (elapsed_secs / 60)',

  -- Accuracy & Errors
  accuracy      DECIMAL(5,2)      NOT NULL DEFAULT 0.00  COMMENT 'Accuracy % = (correct_chars / total_chars) * 100',
  errors        INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Total wrong keystrokes pressed (misses)',
  correct_chars INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Characters typed that matched the passage exactly',
  total_chars   INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Total keystrokes = correct_chars + errors',

  -- Missed Keys Breakdown (JSON)
  -- e.g. [{"key": "e", "count": 3}, {"key": "t", "count": 1}]
  missed_keys   JSON DEFAULT NULL  COMMENT 'Which keys were missed and how many times',

  -- Test Configuration
  duration      SMALLINT UNSIGNED NOT NULL DEFAULT 60    COMMENT 'Test length selected: 15, 30, 60, or 120 seconds',
  elapsed_secs  SMALLINT UNSIGNED NOT NULL DEFAULT 60    COMMENT 'Actual seconds taken to finish the test',
  passage_id    INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Index of the text passage that was shown',
  typed_date    VARCHAR(50) DEFAULT NULL                 COMMENT 'Display date string e.g. 10/29/2026',

  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Exact timestamp test was completed',

  -- Foreign Key
  CONSTRAINT fk_test_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- Data Integrity
  CONSTRAINT chk_accuracy CHECK (accuracy >= 0.00 AND accuracy <= 100.00),

  -- Indexes for fast queries (personal bests, progress charts)
  INDEX idx_test_user_date (user_id, created_at DESC),
  INDEX idx_test_user_wpm  (user_id, wpm DESC)
) ENGINE=InnoDB COMMENT='Typing test results — all speed, accuracy, and miss data per test';


-- ====================================================================
-- TABLE 3: feedback
-- Handles: User feedback form submissions
-- ====================================================================
CREATE TABLE feedback (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED DEFAULT NULL  COMMENT 'Optional: linked user if logged in',

  -- Submitter Info
  name        VARCHAR(100) NOT NULL      COMMENT 'Submitter full name',
  email       VARCHAR(255) NOT NULL      COMMENT 'Submitter email address',

  -- Feedback Content
  rating      TINYINT UNSIGNED NOT NULL DEFAULT 5  COMMENT 'Star rating: 1 (bad) to 5 (excellent)',
  category    VARCHAR(50)      NOT NULL DEFAULT 'General'
                               COMMENT 'Type: General | Bug Report | Suggestion',
  message     TEXT NOT NULL              COMMENT 'Full feedback message text',

  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Submission timestamp',

  -- Foreign Key (nullable — guest users allowed)
  CONSTRAINT fk_feedback_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),

  INDEX idx_feedback_date (created_at DESC)
) ENGINE=InnoDB COMMENT='User feedback, ratings, and bug reports';


-- ====================================================================
-- TABLE 4: practice_sessions
-- Handles: Every keyboard drill session from PracticePage.jsx
-- Modes: all | left | right | home | top | bottom | numbers | numpad | shift | symbols | mixed | speed
-- ====================================================================
CREATE TABLE practice_sessions (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL          COMMENT 'Linked user (references users.id)',

  -- Drill Mode
  mode          VARCHAR(30) NOT NULL DEFAULT 'all'   COMMENT 'Drill type: home | top | numbers | shift | symbols etc.',

  -- Drill Performance (calculated in PracticePage.jsx)
  wpm           SMALLINT UNSIGNED NOT NULL DEFAULT 0     COMMENT 'Drill WPM = (correct / 5) * 12',
  accuracy      DECIMAL(5,2)      NOT NULL DEFAULT 0.00  COMMENT 'Accuracy % in this drill',
  errors        INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Wrong keys pressed in drill',
  correct_chars INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Correct keys pressed in drill',
  total_chars   INT UNSIGNED      NOT NULL DEFAULT 0     COMMENT 'Total keys pressed = correct + errors',

  -- Missed Keys in this Drill
  missed_keys   JSON DEFAULT NULL   COMMENT 'e.g. [{"key":"a","count":2},{"key":"s","count":1}]',
  pattern_used  TEXT DEFAULT NULL   COMMENT 'Exact drill pattern text that was typed',

  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When drill was completed',

  CONSTRAINT fk_practice_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_practice_user_date (user_id, created_at DESC),
  INDEX idx_practice_user_mode (user_id, mode)
) ENGINE=InnoDB COMMENT='Keyboard drill sessions — speed, accuracy and missed keys per drill';


-- ====================================================================
-- VIEW: user_stats (Auto-calculated summary per user for dashboard)
-- ====================================================================
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id                                              AS user_id,
  u.name,
  u.email,
  u.goal_wpm,
  u.total_tests,
  u.total_chars_typed,
  COALESCE(MAX(th.wpm),            0)               AS best_wpm,
  COALESCE(MAX(th.raw_wpm),        0)               AS best_raw_wpm,
  COALESCE(MAX(th.accuracy),       0.00)            AS best_accuracy,
  COALESCE(ROUND(AVG(th.wpm),  1), 0.0)             AS avg_wpm,
  COALESCE(ROUND(AVG(th.accuracy),2), 0.00)         AS avg_accuracy,
  COALESCE(SUM(th.errors),         0)               AS total_errors
FROM users u
LEFT JOIN test_history th ON th.user_id = u.id
GROUP BY u.id, u.name, u.email, u.goal_wpm, u.total_tests, u.total_chars_typed;


-- ====================================================================
-- SEED DATA (Test with demo account)
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
  JSON_ARRAY(
    JSON_OBJECT('key','e','count',3),
    JSON_OBJECT('key','t','count',2),
    JSON_OBJECT('key','o','count',1)
  ),
  60, 60, 1, DATE_FORMAT(NOW(), '%m/%d/%Y')
);

INSERT INTO feedback (user_id, name, email, rating, category, message)
VALUES (1, 'Admin', 'admin@gmail.com', 5, 'General', 'QuickType is fast, smooth and accurate!');

-- Verify
SELECT 'SUCCESS: 3 tables created!' AS Result;
SHOW TABLES;
SELECT id, name, email, theme, goal_wpm, total_tests FROM users;
SELECT id, user_id, wpm, raw_wpm, accuracy, errors, correct_chars, missed_keys FROM test_history;
SELECT * FROM user_stats;
