import React, { useState, useEffect } from 'react';
import { SLIDES } from '../constants/data';

export default function HomePageNew({
  navigateTo,
  startTimedTest,
  bestWpm = 0,
  bestAcc = 100,
  history = [],
  streak = { current: 0, longest: 0 },
  goalWpm = 40,
  setGoalWpm
}) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(() => {
    const stored = parseInt(localStorage.getItem("quickTypeGoal"), 10);
    return isNaN(stored) ? (goalWpm || 40) : stored;
  });

  // AI Coach tips logic matching your script.js buildAiCoachTips
  const [aiTip, setAiTip] = useState(() => {
    if (!history.length) {
      return "Run a quick test and I'll start spotting patterns in your typing.";
    }
    const recent = history.slice(0, 5);
    const avgAcc = recent.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / recent.length;
    if (avgAcc < 90) return `Your last few runs sit around ${Math.round(avgAcc)}% accuracy — slow down about 10% and let accuracy catch up. Speed follows accuracy, not the other way round.`;
    return "Focus on rhythm and the speed will follow naturally.";
  });

  const recent = history.slice(0, 5);
  const avgWpm = recent.length ? Math.round(recent.reduce((a, b) => a + (Number(b.wpm) || 0), 0) / recent.length) : 0;
  const goalPct = Math.max(0, Math.min(100, Math.round((avgWpm / (currentGoal || 40)) * 100)));

  const changeSlide = (delta) => {
    setSliderIndex((prev) => (prev + delta + SLIDES.length) % SLIDES.length);
  };

  const refreshAiCoachTip = () => {
    const recentRuns = history.slice(0, 5);
    const tips = [
      "Precision beats raw speed every time. Slow down slightly and your accuracy will leap.",
      "Keep your wrists floating gently above the desk and eyes glued to the screen.",
      "Anchor your fingers on the Home Row (A S D F — J K L ;) between keystrokes.",
      "Consistent 5-minute daily sessions compound into 80+ WPM faster than marathon practice.",
      "When you make a mistake, don't rush. Type the next word with calm deliberate cadence."
    ];
    if (streak.current >= 3) {
      tips.push(`You're on a ${streak.current}-day streak. One more short test today keeps it alive.`);
    }
    if (recentRuns.length > 0) {
      tips.push(`Average over your last ${recentRuns.length} runs: ${avgWpm} WPM.`);
    }
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const handleGoalChange = (val) => {
    const num = parseInt(val, 10);
    setCurrentGoal(num);
    localStorage.setItem("quickTypeGoal", String(num));
    if (setGoalWpm) setGoalWpm(num);
  };

  const keysRow1 = ["Q","W","E","R","T","Y","U","I","O","P"];
  const keysRow2 = ["A","S","D","F","G","H","J","K","L",";"];
  const keysRow3 = ["Z","X","C","V","B","N","M",",",".","/"];

  // Weekly rhythm bar chart logic
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const weeklyBars = days.map((day, i) => {
    const run = recent[i];
    return {
      day,
      wpm: run ? (Number(run.wpm) || 0) : 0,
    };
  });
  const maxWpmInChart = Math.max(10, ...weeklyBars.map(b => b.wpm));

  return (
    <section id="home" className="page active">
      <div className="landing">

        {/* =====================================================
             HERO SECTION (from your HTML)
        ===================================================== */}
        <div className="landing-hero reveal in-view">
          <div className="landing-blob" style={{ width: '180px', height: '180px', background: '#f6d75b', top: '-60px', right: '60px' }}></div>
          <div className="landing-blob" style={{ width: '140px', height: '140px', background: '#8fd9c4', bottom: '-40px', left: '-40px', animationDelay: '1.5s' }}></div>

          <div className="landing-hero-copy">
            <div className="landing-pill">
              <span className="dot"></span>
              Your daily speed boost
            </div>

            <h1>
              type like<br />
              <span className="lh-pink">you mean it.</span>
            </h1>

            <p className="landing-sub">
              A focused typing arcade for real gains. Find your rhythm, chase your best score, and make the keyboard feel like home — with an AI coach nudging you along the way.
            </p>

            <div className="landing-cta-row">
              <button className="btn-land btn-land-primary" onClick={() => startTimedTest(60)}>
                Start a quick test →
              </button>
              <button className="btn-land btn-land-secondary" onClick={() => navigateTo('practice')}>
                Explore practice
              </button>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-hero-card">
              <h2>Your keyboard gym 🏋️</h2>
              <p>Train one key at a time or challenge your entire keyboard.</p>

              <div className="hero-keyboard">
                {keysRow1.map(k => <div key={k} className="mini-key">{k}</div>)}
                {keysRow2.map(k => <div key={k} className="mini-key">{k}</div>)}
                {keysRow3.map(k => <div key={k} className="mini-key">{k}</div>)}
              </div>

              <div className="landing-hero-stat">
                <span id="homeBest">Best WPM: {history.length ? bestWpm : 0}</span>
                <span id="homeAccuracy">Best Accuracy: {history.length ? `${bestAcc}%` : "0%"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
             MARQUEE
        ===================================================== */}
        <div className="landing-marquee reveal in-view">
          <div className="landing-marquee-track">
            <span>⚡ A superpower</span>
            <span>🎯 One more round</span>
            <span>⌨️ Type like you mean it</span>
            <span>🔥 Keep the streak alive</span>
            <span>⚡ A superpower</span>
            <span>🎯 One more round</span>
            <span>⌨️ Type like you mean it</span>
            <span>🔥 Keep the streak alive</span>
          </div>
        </div>

        {/* =====================================================
             FEATURE CARDS
        ===================================================== */}
        <div className="landing-features">
          <div className="feature-card fc-pink reveal in-view" onClick={() => navigateTo('tests')} style={{ cursor: 'pointer' }}>
            <div className="fc-num">01</div>
            <div className="fc-icon">⏱️</div>
            <h3>Pick a pace</h3>
            <p>15, 30 or 60 seconds. Start where your fingers are today.</p>
          </div>

          <div className="feature-card fc-yellow reveal in-view" onClick={() => navigateTo('practice')} style={{ cursor: 'pointer' }}>
            <div className="fc-num">02</div>
            <div className="fc-icon">⚡</div>
            <h3>Find the flow</h3>
            <p>Words roll in. Your only job is to keep the rhythm moving.</p>
          </div>

          <div className="feature-card fc-mint reveal in-view" onClick={() => navigateTo('progress')} style={{ cursor: 'pointer' }}>
            <div className="fc-num">03</div>
            <div className="fc-icon">🎯</div>
            <h3>Beat yourself</h3>
            <p>See the score, take the win, and come back for one more.</p>
          </div>
        </div>

        {/* =====================================================
             DARK STATS CTA BAND
        ===================================================== */}
        <div className="landing-stats-band reveal in-view">
          <div>
            <h2>Practice<br />has <span className="accent">range.</span></h2>
            <p>
              Tiny daily reps add up. Keep a streak, watch your accuracy climb, and collect proof that you're getting faster.
            </p>
            <div className="landing-cta-row">
              <button className="btn-land btn-land-primary" onClick={() => startTimedTest(60)}>
                Start your streak →
              </button>
            </div>
          </div>

          <div className="stats-chart-card">
            <div className="chip-bubble" id="homeStreakBubble">
              {streak.current > 0 ? "look at you go" : "start today"}
            </div>
            <div className="stats-chart-head">
              <span>Weekly rhythm</span>
              <span className="streak-chip" id="homeStreakChip">{streak.current} day streak</span>
            </div>
            <div className="chart-bars" id="homeChartBars">
              {weeklyBars.map((item, i) => (
                <div key={i} className="bar-col">
                  <div className="bar-val">{item.wpm}</div>
                  <div
                    className={`bar ${i === weeklyBars.length - 1 ? 'today' : ''}`}
                    style={{ height: `${Math.max(10, Math.round((item.wpm / maxWpmInChart) * 100))}%` }}
                  ></div>
                  <div className="bar-day">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
             AI COACH
        ===================================================== */}
        <div className="landing-ai reveal in-view">
          <div className="landing-ai-icon">✨</div>
          <div>
            <div className="landing-ai-label">AI Coach</div>
            <div className="landing-ai-tip" id="aiCoachTip">
              {aiTip}
            </div>
          </div>
          <button className="btn-ai-refresh" onClick={refreshAiCoachTip}>
            New tip ↻
          </button>
        </div>

        {/* =====================================================
             TYPING IN MOTION GALLERY
        ===================================================== */}
        <div className="about-card gallery-card reveal in-view">
          <h2>Typing in Motion</h2>
          <p>Click through a few snapshots for some keyboard inspiration.</p>

          <div className="image-slider" id="typingSlider">
            <button type="button" className="slider-arrow slider-arrow-left" onClick={() => changeSlide(-1)} aria-label="Previous image">
              ‹
            </button>

            <img
              id="typingSliderImg"
              className="slider-img"
              src={SLIDES[sliderIndex]?.url || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=75"}
              width="1200"
              height="675"
              alt={SLIDES[sliderIndex]?.caption || "Focused typing session"}
            />

            <button type="button" className="slider-arrow slider-arrow-right" onClick={() => changeSlide(1)} aria-label="Next image">
              ›
            </button>

            <div className="slider-dots" id="typingSliderDots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`dot-btn ${i === sliderIndex ? 'active' : ''}`}
                  onClick={() => setSliderIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="slider-meta">
            <span id="typingSliderCaption">{SLIDES[sliderIndex]?.caption || "Focused typing session"}</span>
            <span id="typingSliderCounter">{sliderIndex + 1} / {SLIDES.length}</span>
          </div>
        </div>

        {/* =====================================================
             DAILY GOAL SLIDER
        ===================================================== */}
        <div className="landing-goal reveal in-view">
          <div className="goal-head">
            <div>
              <div className="landing-ai-label">Daily WPM Goal</div>
              <div className="goal-value"><span id="goalValue">{currentGoal}</span> WPM</div>
            </div>
            <div className="goal-progress-chip" id="goalProgressChip">{goalPct}%</div>
          </div>

          <input
            type="range"
            id="goalSlider"
            className="goal-slider"
            min="10"
            max="120"
            step="5"
            value={currentGoal}
            onChange={(e) => handleGoalChange(e.target.value)}
          />

          <div className="goal-scale">
            <span>10</span>
            <span>120</span>
          </div>

          <div className="goal-progress-track">
            <div className="goal-progress-fill" id="goalProgressFill" style={{ width: `${goalPct}%` }}></div>
          </div>

          <p className="goal-hint" id="goalHint">
            {recent.length === 0
              ? "Set a target and I'll track how close your recent runs get."
              : goalPct >= 100
                ? `You're averaging ${avgWpm} WPM — already at your goal! Nudge the slider up for a new challenge.`
                : `You're averaging ${avgWpm} WPM — ${currentGoal - avgWpm} WPM to go.`
            }
          </p>
        </div>

      </div>
    </section>
  );
}
