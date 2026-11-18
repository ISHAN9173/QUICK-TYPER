import React from 'react';

export default function AboutPage({ navigateTo }) {
  return (
    <section className="page active">
      <div className="section-header">
        <div className="page-kicker kicker-about">ℹ️ INFO</div>
        <h1>About QuickType</h1>
        <p>A focused typing platform designed for measurable improvement.</p>
      </div>
      <div className="about-grid">
        <div className="about-card">
          <h2>What is QuickType?</h2>
          <p>QuickType is a modern typing practice platform built to help students, professionals and everyday computer users build speed, accuracy and keyboard confidence.</p>
        </div>
        <div className="about-card">
          <h2>Performance-Based WPM</h2>
          <p>Speed is calculated using standard conventions where five correctly typed characters count as one word.</p>
        </div>
        <div className="about-card">
          <h2>Why Practice Consistently?</h2>
          <p>Regular practice builds muscle memory, reduces mistakes and helps you finish digital work faster.</p>
        </div>
        <div className="about-card">
          <h2>Adaptive Practice Passages</h2>
          <p>QuickType includes several timed tests, key-specific drills and a tutorial mode.</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button className="btn btn-primary" onClick={() => navigateTo("tests")}>Start Practicing →</button>
      </div>
    </section>
  );
}
