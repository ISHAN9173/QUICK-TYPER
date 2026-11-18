import React from 'react';
import { BADGES } from '../constants/data';

export default function AchievementsPage({ unlockedBadges, streak }) {
  return (
    <section className="page active">
      <div className="section-header">
        <div className="page-kicker kicker-achievements">🏆 REWARDS</div>
        <h1>Achievements</h1>
        <p>Unlock badges as you build your typing skills.</p>
      </div>
      <div className="dashboard-stats" style={{ marginBottom: 25 }}>
        <div className="dashboard-stat"><small>Badges Unlocked</small><strong>{unlockedBadges.length}</strong></div>
        <div className="dashboard-stat"><small>Total Badges</small><strong>{BADGES.length}</strong></div>
        <div className="dashboard-stat"><small>Current Streak</small><strong>{streak.current} days</strong></div>
        <div className="dashboard-stat"><small>Longest Streak</small><strong>{streak.longest} days</strong></div>
      </div>
      <div className="badge-grid">
        {BADGES.map(b => {
          const isUnlocked = unlockedBadges.includes(b.id);
          return (
            <div key={b.id} className={`badge-tile ${isUnlocked ? "unlocked" : ""}`}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{isUnlocked ? b.desc : `Locked — ${b.desc}`}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
