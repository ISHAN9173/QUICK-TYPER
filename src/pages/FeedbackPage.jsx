import React, { useState, useEffect } from 'react';
import { submitFeedback } from '../lib/api';

export default function FeedbackPage({ navigateTo, showToast, user }) {
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalName = user ? user.name : name.trim();
    const finalEmail = user ? user.email : email.trim();

    if (!finalName || !finalEmail) {
      showToast("Name and email are required.");
      return;
    }

    if (msg.trim().length < 5) {
      showToast("Please enter at least 5 characters for your feedback.");
      return;
    }

    setLoading(true);
    try {
      await submitFeedback(finalName, finalEmail, msg.trim(), rating, user?.id);
      setDone(true);
      showToast("Feedback submitted — thank you!");
    } catch (err) {
      showToast("Could not submit feedback: " + (err.message || "Server offline"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page active">
      <div className="section-header" style={{ textAlign: "center", marginBottom: 24 }}>
        <div className="page-kicker kicker-feedback" style={{ margin: "0 auto 10px" }}>💬 YOUR FEEDBACK</div>
        <h1>Help Us Improve QuickType</h1>
        <p style={{ maxWidth: 540, margin: "0 auto" }}>
          We value your suggestions, bug reports, and thoughts on making QuickType better.
        </p>
      </div>

      <div className="form-card" style={{ maxWidth: 560, margin: "0 auto" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
            <h2 style={{ fontSize: 22, marginBottom: 8, color: "#fff" }}>Thank You!</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>Your feedback has been saved successfully.</p>
            <button className="btn btn-primary" onClick={() => { setDone(false); setMsg(""); }}>
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* If logged in, show user identification banner instead of asking for name/email */}
            {user ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: 14,
                marginBottom: 20
              }}>
                <span style={{ fontSize: 22 }}>👤</span>
                <div style={{ fontSize: 13.5 }}>
                  <div style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
                    Sending as logged-in member
                  </div>
                  <strong style={{ color: "#fff" }}>{user.name}</strong>
                  <span style={{ color: "#94a3b8", marginLeft: 6 }}>({user.email})</span>
                </div>
              </div>
            ) : (
              <>
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </>
            )}

            <label>Rating</label>
            <div style={{ display: "flex", gap: 10, margin: "6px 0 16px" }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 10,
                    border: rating === star ? "1.5px solid #6366f1" : "1px solid var(--border)",
                    background: rating === star ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.03)",
                    color: rating === star ? "#fff" : "var(--muted)",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                >
                  {"★".repeat(star)} ({star})
                </button>
              ))}
            </div>

            <label>Your Message</label>
            <textarea
              rows={4}
              placeholder="What do you think of QuickType? What features would you like to see?"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              required
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: "100%", marginTop: 20 }}
              disabled={loading}
            >
              {loading ? "Submitting…" : "Send Feedback"}
            </button>
          </form>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={() => navigateTo("home")}>← Back to Home</button>
      </div>
    </section>
  );
}
