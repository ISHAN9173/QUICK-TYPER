const express = require('express');
const bcrypt  = require('bcrypt');
const pool    = require('../db/pool');
const router  = express.Router();

// ── POST /api/auth/register ─────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, theme, goal_wpm, total_tests, total_chars_typed, streak_current, streak_longest, streak_last_date, practice_count, unlocked_badges, created_at`,
      [name, email, hash]
    );

    const newUser = insertResult.rows[0];
    res.status(201).json({ user: newUser });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.code === '23505')
      return res.status(409).json({ error: 'Email already registered.' });
    console.error('register error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const result = await pool.query(
      `SELECT id, name, email, password_hash, theme, goal_wpm, total_tests, total_chars_typed,
              streak_current, streak_longest, streak_last_date, practice_count, unlocked_badges
       FROM users WHERE email = $1`,
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password.' });

    // Update last_active_at
    await pool.query(`UPDATE users SET last_active_at = NOW() WHERE id = $1`, [user.id]);

    delete user.password_hash;
    res.json({ user });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
