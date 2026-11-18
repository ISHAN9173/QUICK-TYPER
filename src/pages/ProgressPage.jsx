import React from 'react';

export default function ProgressPage({
  history = [],
  practiceCount = 0,
  bestWpm = 0,
  bestAcc = 0,
  avgWpm = 0,
  avgAcc = 0,
  onClearHistory,
  navigateTo
}) {
  const hasHistory = history && history.length > 0;

  return (
    <section className="page active" id="progress">
      <div className="section-header">
        <div className="page-kicker kicker-progress">📊 ANALYTICS</div>
        <h1>Your Progress</h1>
        <p>Comprehensive overview of your typing speed, precision, and historical tests.</p>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="card dashboard-stat">
          <small>Best WPM</small>
          <strong id="progressBestWpm">{bestWpm}</strong>
        </div>

        <div className="card dashboard-stat">
          <small>Best Accuracy</small>
          <strong id="progressBestAccuracy">{hasHistory ? `${bestAcc}%` : '0%'}</strong>
        </div>

        <div className="card dashboard-stat">
          <small>Average WPM</small>
          <strong>{avgWpm}</strong>
        </div>

        <div className="card dashboard-stat">
          <small>Average Accuracy</small>
          <strong>{hasHistory ? `${avgAcc}%` : '0%'}</strong>
        </div>

        <div className="card dashboard-stat">
          <small>Tests Completed</small>
          <strong id="progressTests">{history.length}</strong>
        </div>

        <div className="card dashboard-stat">
          <small>Practice Sessions</small>
          <strong id="progressPractice">{practiceCount}</strong>
        </div>
      </div>

      {/* Test History List */}
      <div className="card" style={{ padding: '24px', marginTop: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '20px' }}>Test History</h2>
            <p style={{ color: 'var(--muted)', marginTop: '4px', fontSize: '14px' }}>
              Your recent typing evaluations in reverse chronological order.
            </p>
          </div>
          {hasHistory && (
            <button
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '13px' }}
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your test history?")) {
                  if (onClearHistory) onClearHistory();
                }
              }}
              title="Delete stored test runs"
            >
              🗑️ Clear History
            </button>
          )}
        </div>

        <div className="history-list" id="historyList">
          {hasHistory ? (
            history.map((item, idx) => {
              const acc = Math.round(Number(item.accuracy) || 0);
              const wpm = Number(item.wpm) || 0;
              const errors = Number(item.errors) || 0;
              const durationSec = Number(item.duration) || 60;
              const testTitle = durationSec >= 60 ? `${Math.round(durationSec / 60)} Minute Test` : `${durationSec}s Drill`;

              return (
                <div key={idx} className="card history-item">
                  <div>
                    <strong>{testTitle}</strong>
                    <small>{item.date || "Today"}</small>
                  </div>

                  <strong style={{ color: '#818cf8', fontSize: '16px' }}>
                    ⚡ {wpm} WPM
                  </strong>

                  <strong style={{
                    color: acc >= 95 ? '#4ade80' : acc >= 85 ? '#facc15' : '#f87171',
                    fontSize: '15px'
                  }}>
                    {acc}%
                  </strong>

                  <strong style={{
                    color: errors === 0 ? '#4ade80' : 'var(--muted)',
                    fontSize: '14px'
                  }}>
                    {errors} {errors === 1 ? 'error' : 'errors'}
                  </strong>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⌨️</div>
              <h3 style={{ color: 'var(--text)', marginBottom: '6px' }}>No Tests Recorded Yet</h3>
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                Complete your first typing test to see your speed and accuracy metrics tracked here.
              </p>
              {navigateTo && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo("tests")}
                >
                  ⚡ Take a Typing Test
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
