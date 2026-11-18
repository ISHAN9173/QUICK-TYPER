const express = require('express');
const pool    = require('../db/pool');
const router  = express.Router();

// ── GET /api/users ────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, theme, goal_wpm, total_tests, total_chars_typed,
              streak_current, streak_longest, streak_last_date, practice_count, unlocked_badges,
              created_at, last_active_at
       FROM users ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('get all users error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ── POST /api/users ───────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const bcrypt = require('bcrypt');
    const hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('123456', 10);
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hash]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error('add user error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ── GET /api/users/:id ────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, theme, goal_wpm,
              total_tests, total_chars_typed,
              streak_current, streak_longest, streak_last_date,
              practice_count, unlocked_badges,
              created_at, last_active_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'User not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('get user error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/users/:id ──────────────────────────────────────
router.patch('/:id', async (req, res) => {
  const {
    theme,
    goal_wpm,
    streak_current,
    streak_longest,
    streak_last_date,
    practice_count,
    unlocked_badges
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
         theme            = COALESCE($1, theme),
         goal_wpm         = COALESCE($2, goal_wpm),
         streak_current   = COALESCE($3, streak_current),
         streak_longest   = COALESCE($4, streak_longest),
         streak_last_date = COALESCE($5, streak_last_date),
         practice_count   = COALESCE($6, practice_count),
         unlocked_badges  = COALESCE($7, unlocked_badges),
         last_active_at   = NOW()
       WHERE id = $8
       RETURNING id, name, email, theme, goal_wpm,
                 total_tests, total_chars_typed,
                 streak_current, streak_longest, streak_last_date,
                 practice_count, unlocked_badges, last_active_at`,
      [
        theme != null ? theme : null,
        goal_wpm != null ? Number(goal_wpm) : null,
        streak_current != null ? Number(streak_current) : null,
        streak_longest != null ? Number(streak_longest) : null,
        streak_last_date != null ? streak_last_date : null,
        practice_count != null ? Number(practice_count) : null,
        unlocked_badges != null ? JSON.stringify(unlocked_badges) : null,
        req.params.id
      ]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'User not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('update user error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/users/:id/badges ────────────────────────────────
router.post('/:id/badges', async (req, res) => {
  const { badge_id } = req.body;
  if (!badge_id) return res.status(400).json({ error: 'badge_id is required.' });

  try {
    await pool.query(
      `INSERT INTO user_badges (user_id, badge_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, badge_id) DO NOTHING`,
      [req.params.id, badge_id]
    );
    res.status(201).json({ message: 'Badge saved.' });
  } catch (err) {
    console.error('save badge error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/users/:id/badges ─────────────────────────────────
router.get('/:id/badges', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT badge_id, earned_at FROM user_badges WHERE user_id = $1 ORDER BY earned_at ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('get badges error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
