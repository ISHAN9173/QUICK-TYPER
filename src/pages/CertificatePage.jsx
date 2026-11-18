import React from 'react';

export default function CertificatePage({ lastResult, navigateTo, user }) {
  const recipientName = user?.name || "Member";

  if (!lastResult || !lastResult.wpm) {
    return (
      <section className="page active">
        <div className="section-header">
          <div className="page-kicker kicker-certificate">🎖️ CEREMONY</div>
          <h1>Certificate of Achievement</h1>
          <p>Earn your official verified typing speed certificate.</p>
        </div>
        <div className="card" style={{ maxWidth: 500, margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>📜</div>
          <h2>No Test Completed Yet</h2>
          <p style={{ color: "var(--muted)", margin: "12px 0 24px" }}>
            Take your first 1-minute typing test to calculate your official WPM, accuracy, and generate your printable certificate!
          </p>
          <button className="btn btn-primary" onClick={() => navigateTo("tests")}>
            Start a Typing Test →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page active">
      <div className="section-header">
        <div className="page-kicker kicker-certificate">🎖️ CEREMONY</div>
        <h1>Certificate of Achievement</h1>
        <p>Your verified typing milestone.</p>
      </div>
      <div className="certificate" id="certificateContent">
        <p style={{ letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, color: "var(--primary)" }}>QUICKTYPE</p>
        <h1 style={{ margin: "10px 0" }}>Certificate of Typing Achievement</h1>
        <p style={{ marginTop: 15, fontSize: "16px", color: "#64748b" }}>
          This certifies that <strong>{recipientName}</strong> has officially evaluated their keyboard typing speed on QuickType.
        </p>
        <div className="certificate-score">{lastResult.wpm} WPM</div>
        <h3 style={{ margin: "10px 0", color: "#10b981" }}>{lastResult.accuracy}% Accuracy</h3>
        <p style={{ marginTop: 20, color: "#94a3b8", fontSize: "13px" }}>
          Achieved on {lastResult.date || new Date().toLocaleDateString()}
        </p>
      </div>
      <div style={{ textAlign: "center", marginTop: 24, display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print Certificate</button>
        <button className="btn btn-secondary" onClick={() => navigateTo("progress")}>View Progress Analytics</button>
      </div>
    </section>
  );
}
