import React, { useState } from 'react';
import { SLIDES } from '../constants/data';

export default function HomePage({
  navigateTo,
  startTimedTest,
  bestWpm = 0,
  bestAcc = 0,
  history = [],
  streak = { current: 0 },
  goalWpm = 40,
  setGoalWpm
}) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [aiTip, setAiTip] = useState("Focus on accuracy first. Speed naturally follows muscle memory.");

  const recent = history.slice(0, 5);
  const avgWpm = recent.length ? Math.round(recent.reduce((a, b) => a + (Number(b.wpm) || 0), 0) / recent.length) : 0;
  const goalPct = Math.min(100, Math.round((avgWpm / goalWpm) * 100));

  const changeSlide = (delta) => {
    setSliderIndex((sliderIndex + delta + SLIDES.length) % SLIDES.length);
  };

  const refreshTip = () => {
    const tips = [
      "Precision beats raw speed every time. Slow down slightly and your accuracy will leap.",
      "Keep your wrists floating gently above the desk and eyes glued to the screen.",
      "Anchor your fingers on the Home Row (A S D F — J K L ;) between keystrokes.",
      "Consistent 5-minute daily sessions compound into 80+ WPM faster than marathon practice.",
      "When you make a mistake, don't rush. Type the next word with calm deliberate cadence."
    ];
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <section className="page active">
      <div className="simple-home-container">
        {/* Modern Hero with Keyboard Image Showcase */}
        <div className="simple-hero card">
          <div className="simple-hero-content">
            <div className="simple-kicker">⚡ FAST & CLEAN TYPING TRAINER</div>
            <h1 className="simple-hero-title">
              Master Your <span className="blue-gradient-text">Keyboard Speed</span>
            </h1>
            <p className="simple-hero-subtitle">
              Build genuine muscle memory, minimize typing errors, and track your WPM growth with real-time feedback.
            </p>

            <div className="simple-cta-row">
              <button className="btn btn-primary btn-hero" onClick={() => startTimedTest(60)}>
                ⚡ Start 1-Minute Test
              </button>
              <button className="btn btn-secondary btn-hero" onClick={() => startTimedTest(180)}>
                ⏱️ 3-Minute Test
              </button>
              <button className="btn btn-secondary btn-hero" onClick={() => navigateTo("practice")}>
                🏋️ Practice Drills
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="hero-metrics-strip">
              <div className="mini-metric">
                <small>Best Speed</small>
                <strong>{bestWpm} WPM</strong>
              </div>
              <div className="mini-metric">
                <small>Accuracy</small>
                <strong>{bestAcc}%</strong>
              </div>
              <div className="mini-metric">
                <small>Day Streak</small>
                <strong>🔥 {streak?.current || 0}</strong>
              </div>
            </div>
          </div>

          {/* Hero Keyboard Image Banner */}
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
              alt="Mechanical Keyboard"
              className="hero-keyboard-img"
            />
            <div className="hero-image-overlay">
              <span className="overlay-badge">⌨️ Precision & Flow</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="simple-features-grid">
          <div className="card simple-feature-card" onClick={() => navigateTo("tests")}>
            <div className="feature-icon">⏱️</div>
            <h3>Timed Speed Tests</h3>
            <p>Take official 1, 3, or 5-minute typing challenges with real-time keystroke tracking and completion certificates.</p>
            <span className="card-link">Start a test →</span>
          </div>

          <div className="card simple-feature-card" onClick={() => navigateTo("practice")}>
            <div className="feature-icon">⌨️</div>
            <h3>Keyboard Practice Lab</h3>
            <p>Drill specific keyboard zones: Home Row, Left Hand, Right Hand, Numbers, Symbols, and the Numpad.</p>
            <span className="card-link">Explore drills →</span>
          </div>

          <div className="card simple-feature-card" onClick={() => navigateTo("progress")}>
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>Review comprehensive WPM trends, accuracy history, error counts, and unlocked achievement badges.</p>
            <span className="card-link">View analytics →</span>
          </div>
        </div>

        {/* Previous Keyboard Photo Slider (Clean Modern Blue Edition) */}
        <div className="card keyboard-gallery-card">
          <div className="gallery-header">
            <div>
              <small className="section-sublabel">GALLERY</small>
              <h2>Keyboard in Motion</h2>
              <p>Visual snapshots of mechanical keyboards and focused typing setups.</p>
            </div>
            <div className="gallery-nav-buttons">
              <button className="gallery-arrow-btn" onClick={() => changeSlide(-1)} title="Previous photo">‹</button>
              <button className="gallery-arrow-btn" onClick={() => changeSlide(1)} title="Next photo">›</button>
            </div>
          </div>

          <div className="gallery-image-frame">
            <img
              className="gallery-photo"
              src={SLIDES[sliderIndex].src}
              alt={SLIDES[sliderIndex].caption}
            />
            <div className="gallery-caption-bar">
              <span className="gallery-caption-text">📷 {SLIDES[sliderIndex].caption}</span>
              <span className="gallery-counter">{sliderIndex + 1} / {SLIDES.length}</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="gallery-dots">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`gallery-dot ${sliderIndex === idx ? "active" : ""}`}
                onClick={() => setSliderIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Goal Setting & AI Coach Row */}
        <div className="simple-bottom-grid">
          {/* Goal Tracker */}
          <div className="card simple-goal-card">
            <div className="goal-card-header">
              <div>
                <small className="section-sublabel">DAILY TARGET</small>
                <h3>Speed Goal: <span className="blue-text">{goalWpm} WPM</span></h3>
              </div>
              <span className="goal-chip">{goalPct}% Achieved</span>
            </div>

            <input
              type="range"
              className="simple-slider"
              min="20"
              max="120"
              step="5"
              value={goalWpm}
              onChange={(e) => setGoalWpm(Number(e.target.value))}
            />
            <div className="slider-labels">
              <span>20 WPM</span>
              <span>60 WPM</span>
              <span>120 WPM</span>
            </div>

            <div className="goal-status-text">
              {recent.length === 0 ? (
                <span>Complete your first test to track your average against your goal.</span>
              ) : (
                <span>Recent average: <strong>{avgWpm} WPM</strong> across your last {recent.length} test{recent.length > 1 ? 's' : ''}.</span>
              )}
            </div>
          </div>

          {/* Coach Advice */}
          <div className="card simple-coach-card">
            <div className="coach-header">
              <span className="coach-icon">💡</span>
              <small className="section-sublabel">TYPING COACH TIP</small>
            </div>
            <p className="coach-tip-text">"{aiTip}"</p>
            <button className="btn btn-secondary btn-sm" onClick={refreshTip}>
              ↻ Next Tip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
