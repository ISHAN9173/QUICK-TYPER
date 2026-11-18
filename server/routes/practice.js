const express = require('express');
const pool    = require('../db/pool');
const router  = express.Router();

// ── GET /api/practice/:userId ─────────────────────────────────
router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mode, wpm, accuracy, errors, correct_chars,
              total_chars, missed_keys, pattern_used, created_at
       FROM practice_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('get practice error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/practice ────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    user_id,
    mode          = 'all',
    wpm           = 0,
    accuracy      = 0,
    errors        = 0,
    correct_chars = 0,
    total_chars   = 0,
    missed_keys   = [],
    pattern_used  = '',
  } = req.body;

  if (!user_id)
    return res.status(400).json({ error: 'user_id is required.' });

  try {
    const insertResult = await pool.query(
      `INSERT INTO practice_sessions
         (user_id, mode, wpm, accuracy, errors, correct_chars,
          total_chars, missed_keys, pattern_used)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, user_id, mode, wpm, accuracy, errors, correct_chars, total_chars, created_at`,
      [
        user_id, mode, wpm, accuracy, errors, correct_chars,
        total_chars, JSON.stringify(missed_keys), pattern_used
      ]
    );

    // Update last_active_at and practice_count on users table
    await pool.query(
      `UPDATE users SET last_active_at = NOW(), practice_count = practice_count + 1 WHERE id = $1`,
      [user_id]
    );

    const record = insertResult.rows[0];
    res.status(201).json(record);
  } catch (err) {
    console.error('save practice error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/practice/:userId/summary ────────────────────────
router.get('/:userId/summary', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         mode,
         COUNT(*)                             AS sessions,
         ROUND(AVG(wpm), 1)                   AS avg_wpm,
         ROUND(AVG(accuracy), 2)              AS avg_accuracy,
         SUM(errors)                          AS total_errors,
         MAX(wpm)                             AS best_wpm
       FROM practice_sessions
       WHERE user_id = $1
       GROUP BY mode
       ORDER BY sessions DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('practice summary error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
