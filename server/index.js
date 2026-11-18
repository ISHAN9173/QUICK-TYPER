const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express    = require('express');
const cors       = require('cors');

const authRoutes     = require('./routes/auth');
const usersRoutes    = require('./routes/users');
const historyRoutes  = require('./routes/history');
const practiceRoutes = require('./routes/practice');
const feedbackRoutes = require('./routes/feedback');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    usersRoutes);
app.use('/api/history',  historyRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/feedback', feedbackRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: 'quicktype_db', time: new Date() }));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`QuickType API server running on http://localhost:${PORT}`);
});
