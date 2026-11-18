import React, { useState, useEffect } from 'react';
import { loginUser, registerUser, checkServerHealth } from '../lib/api';

export default function LoginPage({ navigateTo, showToast, onLogin, user, onLogout, history = [], streak, goalWpm }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dbStatus, setDbStatus] = useState({ checked: false, connected: false });

  // Check backend & database connection status
  useEffect(() => {
    let mounted = true;
    checkServerHealth().then(status => {
      if (mounted) {
        setDbStatus({
          checked: true,
          connected: Boolean(status && status.connected)
        });
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        const res = await registerUser(name.trim(), email.trim(), password);
        const newUser = res.user || res;
        showToast(`Welcome, ${newUser.name}! Account created.`);
        localStorage.setItem("quickTypeUser", JSON.stringify(newUser));
        if (onLogin) onLogin(newUser);
      } else {
        const res = await loginUser(email.trim(), password);
        const loggedInUser = res.user || res;
        showToast(`Welcome back, ${loggedInUser.name}! ✅`);
        localStorage.setItem("quickTypeUser", JSON.stringify(loggedInUser));
        if (onLogin) onLogin(loggedInUser);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render Logged-In Profile Dashboard ──
  if (user) {
    const testsCount = history.length;
    const bestWpm = testsCount ? Math.max(...history.map(h => Number(h.wpm) || 0)) : 0;
    const userInitial = (typeof user.name === "string" && user.name.trim().length > 0)
      ? user.name.trim().charAt(0).toUpperCase()
      : (typeof user.email === "string" && user.email.trim().length > 0)
      ? user.email.trim().charAt(0).toUpperCase()
      : "U";
    const displayName = (typeof user.name === "string" && user.name.trim().length > 0)
      ? user.name
      : (typeof user.email === "string" && user.email.trim().length > 0)
      ? user.email.split("@")[0]
      : "Member";

    return (
      <section className="page active">
        <div className="login-container">
          <div className="profile-dashboard-card">
            {/* Header / Avatar */}
            <div className="profile-header">
              <div className="profile-avatar-large">
                👤
              </div>
              <div className="profile-titles" style={{ flex: 1 }}>
                <h2>{displayName}</h2>
                <p className="profile-email">📧 {user.email || "member@quicktype.com"}</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                  <span className="account-badge">✓ Active Member</span>
                  <span className={`db-status-pill ${dbStatus.connected ? "online" : "offline"}`}>
                    {dbStatus.connected ? "🟢 PostgreSQL Connected" : "🟡 Offline Mode"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Statistics Grid */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="stat-label">Goal WPM</span>
                <span className="stat-value">{user.goal_wpm || goalWpm || 40}</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Best Speed</span>
                <span className="stat-value">{bestWpm} <small>WPM</small></span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Tests Completed</span>
                <span className="stat-value">{testsCount}</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Daily Streak</span>
                <span className="stat-value">🔥 {streak?.current || 0}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={() => navigateTo("typingTest")}>
                ⚡ Start Typing Test
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo("progress")}>
                📈 View Detailed Progress
              </button>
              <button className="btn btn-danger" onClick={onLogout}>
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Render Clean, Logical Login / Signup Form ──
  return (
    <section className="page active">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">QuickType</div>
          <div className="page-kicker kicker-login" style={{ margin: "0 auto 10px" }}>🔐 ACCOUNT ACCESS</div>
          <div className="login-subtitle">
            {isSignup ? "Create your personal QuickType account" : "Log in to track your typing progress"}
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${!isSignup ? "active" : ""}`}
              onClick={() => { setIsSignup(false); setError(""); }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-tab ${isSignup ? "active" : ""}`}
              onClick={() => { setIsSignup(true); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          <div className="form-card">
            <form onSubmit={handleAuth}>
              {isSignup && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="name"
                  />
                </>
              )}

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />

              {error && (
                <div style={{
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  marginTop: 14,
                  textAlign: "center"
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 20 }}
                disabled={loading}
              >
                {loading ? "Verifying…" : isSignup ? "Create Account" : "Log In"}
              </button>
            </form>

            <div className="demo-note" style={{ marginTop: 20 }}>
              Demo Account: <code>admin@gmail.com</code> &bull; Password: <code>12345</code>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => navigateTo("home")}>← Back to Home</button>
          </div>
        </div>
      </div>
    </section>
  );
}
