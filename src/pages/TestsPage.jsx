import React from 'react';

export default function TestsPage({ startTimedTest }) {
  return (
    <section className="page active">
      <div className="section-header">
        <div className="page-kicker kicker-tests">⌨️ SPEED TEST</div>
        <h1>Typing Tests</h1>
        <p>Measure your real typing speed and accuracy.</p>
      </div>
      <div className="test-options">
        <div className="card test-option">
          <div className="big">1</div>
          <h3>1 Minute</h3>
          <p>Quick speed challenge.</p>
          <button className="btn btn-primary" onClick={() => startTimedTest(60)}>Start Test</button>
        </div>
        <div className="card test-option">
          <div className="big">3</div>
          <h3>3 Minutes</h3>
          <p>Balanced typing challenge.</p>
          <button className="btn btn-primary" onClick={() => startTimedTest(180)}>Start Test</button>
        </div>
        <div className="card test-option">
          <div className="big">5</div>
          <h3>5 Minutes</h3>
          <p>Full endurance challenge.</p>
          <button className="btn btn-primary" onClick={() => startTimedTest(300)}>Start Test</button>
        </div>
      </div>
    </section>
  );
}
