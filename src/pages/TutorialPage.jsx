import React, { useState } from 'react';
import { TUTORIAL_SCREENS } from '../constants/data';

export default function TutorialPage({ navigateTo }) {
  const [index, setIndex] = useState(0);
  const screen = TUTORIAL_SCREENS[index];

  return (
    <section className="page active">
      <div className="section-header">
        <div className="page-kicker kicker-tutorial">🎓 LEARN</div>
        <h1>Typing Tutorial</h1>
        <p>Build proper typing technique from the ground up.</p>
      </div>
      <div className="card tutorial-card">
        <div className="tutorial-progress">
          {TUTORIAL_SCREENS.map((_, i) => (
            <div key={i} className={`progress-dot ${i <= index ? "active" : ""}`} />
          ))}
        </div>
        <div className="tutorial-screen">
          <div className="icon">{screen.icon}</div>
          <h2>{screen.title}</h2>
          <p>{screen.text}</p>
        </div>
        <div className="tutorial-actions">
          <button
            className="btn btn-secondary"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => (index === TUTORIAL_SCREENS.length - 1 ? navigateTo("practice") : setIndex(index + 1))}
          >
            {index === TUTORIAL_SCREENS.length - 1 ? "Start Practice →" : "Continue →"}
          </button>
        </div>
      </div>
    </section>
  );
}
