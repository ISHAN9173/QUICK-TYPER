const express = require('express');
const pool    = require('../db/pool');
const router  = express.Router();

// ── POST /api/feedback ──────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, message, rating = 5, user_id = null } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'Name, email and message are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO feedback (user_id, name, email, message, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, rating, created_at`,
      [user_id || null, name, email, message, rating]
    );
    const row = result.rows && result.rows.length ? result.rows[0] : { id: result.insertId, name, email };
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: row });
  } catch (err) {
    console.error('feedback error:', err.message);
    res.status(500).json({ error: 'Server error saving feedback.' });
  }
});

// ── GET /api/feedback ───────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, name, email, message, rating, created_at
       FROM feedback
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('get feedback error:', err.message);
    res.status(500).json({ error: 'Server error fetching feedback.' });
  }
});

module.exports = router;
