// src/lib/api.js
// ─────────────────────────────────────────────────────────────
// Real HTTP calls to the QuickType PostgreSQL / Express backend.
// In production on Vercel: '/api'
// In local development: 'http://localhost:5000/api'
// ─────────────────────────────────────────────────────────────

const isBrowser = typeof window !== 'undefined';
const isLocal = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const BASE = process.env.REACT_APP_API_URL || (isLocal ? 'http://localhost:5000/api' : '/api');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (netErr) {
    if (path === '/auth/login' || path === '/auth/register') {
      throw new Error('Could not connect to server. Is the backend running?');
    }
    console.warn(`[API Network Error] ${path}:`, netErr.message);
    if (path.startsWith('/history/')) {
      const hist = localStorage.getItem('quickTypeHistory');
      return hist ? JSON.parse(hist) : [];
    }
    if (path === '/history' && options.method === 'POST') {
      return { id: Date.now(), ...(options.body || {}) };
    }
    if (path === '/practice' && options.method === 'POST') {
      return { id: Date.now(), ...(options.body || {}) };
    }
    throw new Error('Connection failed. Please check your network.');
  }

  let data = {};
  try {
    data = await res.json();
  } catch (jsonErr) {}

  if (!res.ok) {
    // Return the actual backend error (e.g. "Invalid email or password" or "Email already registered")
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

// ── Health Check ─────────────────────────────────────────────
export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { connected: false };
    const data = await res.json();
    return { connected: true, ...data };
  } catch {
    return { connected: false };
  }
}

// ── Auth ─────────────────────────────────────────────────────
export function registerUser(name, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

// ── User Profile ──────────────────────────────────────────────
export function getUser(userId) {
  return request(`/users/${userId}`);
}

export function updateUser(userId, fields) {
  return request(`/users/${userId}`, {
    method: 'PATCH',
    body: fields,
  });
}

export function saveBadge(userId, badgeId) {
  return request(`/users/${userId}/badges`, {
    method: 'POST',
    body: { badge_id: badgeId },
  });
}

export function getBadges(userId) {
  return request(`/users/${userId}/badges`);
}

// ── Test History ──────────────────────────────────────────────
export function getHistory(userId) {
  return request(`/history/${userId}`);
}

export function saveTestResult(userId, result) {
  return request('/history', {
    method: 'POST',
    body: { user_id: userId, ...result },
  });
}

export function getStats(userId) {
  return request(`/history/${userId}/stats`);
}

export function clearHistory(userId) {
  return request(`/history/${userId}`, { method: 'DELETE' });
}

// ── Practice ──────────────────────────────────────────────────
export function savePracticeSession(userId, session) {
  return request('/practice', {
    method: 'POST',
    body: { user_id: userId, ...session },
  });
}

export function getPracticeSessions(userId) {
  return request(`/practice/${userId}`);
}

export function getPracticeSummary(userId) {
  return request(`/practice/${userId}/summary`);
}

// ── Feedback ──────────────────────────────────────────────────
export function submitFeedback(name, email, message, rating = 5, user_id = null) {
  return request('/feedback', {
    method: 'POST',
    body: { name, email, message, rating, user_id },
  });
}
