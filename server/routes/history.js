const express = require('express');
const pool    = require('../db/pool');
const router  = express.Router();

// ── GET /api/history/:userId ─────────────────────────────────
router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars,
              missed_keys, duration, elapsed_secs, typed_date, created_at
       FROM test_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('get history error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/history ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    user_id,
    wpm          = 0,
    raw_wpm      = 0,
    accuracy     = 0,
    errors       = 0,
    correct_chars = 0,
    total_chars  = 0,
    missed_keys  = [],
    duration     = 60,
    elapsed_secs = 60,
    passage_id   = 0,
    typed_date,
  } = req.body;

  if (!user_id || wpm == null || accuracy == null)
    return res.status(400).json({ error: 'user_id, wpm and accuracy are required.' });

  try {
    const insertResult = await pool.query(
      `INSERT INTO test_history
         (user_id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars,
          missed_keys, duration, elapsed_secs, passage_id, typed_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, user_id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars, duration, typed_date, created_at`,
      [
        user_id, wpm, raw_wpm, accuracy, errors, correct_chars, total_chars,
        JSON.stringify(missed_keys),
        duration, elapsed_secs, passage_id,
        typed_date || new Date().toLocaleDateString()
      ]
    );

    // Keep lifetime counters in sync on users table
    await pool.query(
      `UPDATE users
       SET total_tests       = total_tests + 1,
           total_chars_typed = total_chars_typed + $2,
           last_active_at    = NOW()
       WHERE id = $1`,
      [user_id, total_chars]
    );

    const record = insertResult.rows && insertResult.rows.length ? insertResult.rows[0] : { id: insertResult.insertId, user_id, wpm, accuracy, errors };
    res.status(201).json(record);
  } catch (err) {
    console.error('save history error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/history/:userId/stats ───────────────────────────
router.get('/:userId/stats', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)                                  AS total_tests,
         COALESCE(MAX(wpm), 0)                    AS best_wpm,
         COALESCE(MAX(raw_wpm), 0)                AS best_raw_wpm,
         COALESCE(ROUND(AVG(wpm), 1), 0)          AS avg_wpm,
         COALESCE(MAX(accuracy), 0)               AS best_accuracy,
         COALESCE(ROUND(AVG(accuracy), 2), 0)     AS avg_accuracy,
         COALESCE(SUM(errors), 0)                 AS total_errors,
         COALESCE(SUM(correct_chars), 0)          AS total_correct_chars,
         COALESCE(SUM(total_chars), 0)            AS total_chars_typed
       FROM test_history
       WHERE user_id = $1`,
      [req.params.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('stats error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── DELETE /api/history/:userId ──────────────────────────────
router.delete('/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM test_history WHERE user_id = $1', [req.params.userId]);
    await pool.query(
      `UPDATE users SET total_tests = 0, total_chars_typed = 0 WHERE id = $1`,
      [req.params.userId]
    );
    res.json({ message: 'History cleared.' });
  } catch (err) {
    console.error('clear history error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
