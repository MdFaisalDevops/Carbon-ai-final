import React from 'react';
import { HelpCircle, Award, Flame, Car, Utensils2, Zap, Trash2 } from 'lucide-react';

const BADGE_META = [
  { id: 'low_car', name: 'Low Car Hero', icon: Car, hint: 'Choose Metro, EV, or cycle transit' },
  { id: 'plant_based', name: 'Plant-Based Week', icon: Utensils2, hint: 'Choose vegetarian or vegan diet' },
  { id: 'energy_saver', name: 'Energy Saver', icon: Zap, hint: 'AC runtimes under low or solar' },
  { id: 'zero_waste', name: 'Zero Waste Day', icon: Trash2, hint: 'Select compost or separated wet/dry' },
  { id: 'streak', name: 'Consistency Streak', icon: Flame, hint: 'Maintain eco tracking streak' }
];

export default function Gamification({ score, level, streakDays, weeklySaved, habits }) {
  
  // Calculate level parameters
  let minBound = 0;
  let maxBound = 1000;
  let nextStanding = 'Green Optimizer';
  
  if (score <= 300) {
    minBound = 0; maxBound = 300; nextStanding = 'Eco Beginner';
  } else if (score <= 600) {
    minBound = 301; maxBound = 600; nextStanding = 'Conscious User';
  } else if (score <= 750) {
    minBound = 601; maxBound = 750; nextStanding = 'Balanced User';
  } else if (score <= 900) {
    minBound = 751; maxBound = 900; nextStanding = 'Green Optimizer';
  } else {
    minBound = 901; maxBound = 1000; nextStanding = 'Eco Legend';
  }

  const range = maxBound - minBound;
  const userProgress = score - minBound;
  const progressPercent = Math.min(100, Math.max(0, (userProgress / range) * 100));

  // Determine badge unlocks reactively
  const badgeStatus = {
    low_car: ['metro', 'ev', 'cycle'].includes(habits.transport),
    plant_based: ['vegetarian', 'vegan'].includes(habits.diet),
    energy_saver: ['low', 'solar'].includes(habits.energy),
    zero_waste: habits.waste === 'compost',
    streak: true // starts unlocked
  };

  const unlockedBadgesCount = Object.values(badgeStatus).filter(Boolean).length;

  // Build Leaderboard mock rows mapping user score dynamically
  const leaderboardMock = [
    { name: 'Kunal Shah', score: 920, level: 'Green Optimizer', streak: 28, saved: 85.4, isSelf: false },
    { name: 'Priya Sharma', score: 810, level: 'Balanced User', streak: 15, saved: 62.1, isSelf: false },
    { name: 'Arjun Mehta', score: score, level: level, streak: streakDays, saved: weeklySaved, isSelf: true },
    { name: 'Amit Patel', score: 510, level: 'Eco Beginner', streak: 4, saved: 29.5, isSelf: false },
    { name: 'Neha Gupta', score: 340, level: 'Eco Beginner', streak: 2, saved: 12.0, isSelf: false }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="gamification-grid">
      
      {/* 1. Level progression dashboard */}
      <div className="glass-card level-status-card">
        <div className="card-header">
          <h3>Level Progression</h3>
          <span className="info-icon" title="Community standing mapped against Carbon Score.">
            <HelpCircle size={16} />
          </span>
        </div>

        <div className="level-progress-hero">
          <div className="level-badge-large">
            <Award size={32} />
          </div>
          <div className="level-detail-texts">
            <span className="level-subtitle-top">Current Standing</span>
            <h4>{level}</h4>
            <p>Unlocks: {unlockedBadgesCount} / {BADGE_META.length} Badges earned</p>
          </div>
        </div>

        <div className="level-progress-bar-container">
          <div className="level-bar-bounds">
            <span>{minBound}</span>
            <span>{maxBound}</span>
          </div>
          <div className="level-bar-track">
            <div className="level-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="level-bar-labels">
            <span>{score} Score</span>
            <span>Next: {nextStanding}</span>
          </div>
        </div>

        <div className="streak-status-box" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Flame size={28} className="streak-icon" style={{ marginRight: 16 }} />
          </div>
          <div className="streak-box-details">
            <h4>{streakDays} Day Streak Active!</h4>
            <p>You have logged your habits or implemented carbon improvements daily. Keep it up to lock in higher ranks!</p>
          </div>
        </div>
      </div>

      {/* 2. Badges collection board */}
      <div className="glass-card badges-card">
        <div className="card-header">
          <h3>Your Carbon Mind Badges</h3>
          <span className="info-icon" title="Earned milestones unlocked by green habits configuration.">
            <HelpCircle size={16} />
          </span>
        </div>
        <p className="panel-subtitle">Perform green adjustments to unlock new achievements</p>

        <div className="badges-grid">
          {BADGE_META.map(badge => {
            const Icon = badge.icon;
            const isUnlocked = badgeStatus[badge.id];

            return (
              <div key={badge.id} className={`badge-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon-holder">
                  <Icon size={20} />
                </div>
                <span className="badge-name">{badge.name}</span>
                <span className="badge-hint">{badge.hint}</span>
                {!isUnlocked && <span style={{ position: 'absolute', bottom: 6, right: 6, fontSize: 10 }}>🔒</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Community Leaderboard */}
      <div className="glass-card leaderboard-card col-span-2">
        <div className="card-header">
          <h3>Global Leaderboard</h3>
          <span className="info-icon" title="Community standings of carbon tracked profiles.">
            <HelpCircle size={16} />
          </span>
        </div>
        <p className="panel-subtitle">Compete with urban green innovators in India</p>

        <div className="leaderboard-container">
          <div className="leaderboard-header-row">
            <span className="col-rank">Rank</span>
            <span className="col-user">User</span>
            <span className="col-level">Level</span>
            <span className="col-streak">Streak</span>
            <span className="col-score">Score</span>
            <span className="col-saved">Weekly Saved</span>
          </div>

          <div className="leaderboard-rows">
            {leaderboardMock.map((user, idx) => (
              <div 
                key={idx} 
                className={`leaderboard-user-row ${user.isSelf ? 'current-user' : ''}`}
              >
                <span className="col-rank">#{idx + 1}</span>
                <div className="col-user user-identity">
                  <div className="user-identity-avatar" style={{ 
                    background: user.isSelf ? 'linear-gradient(135deg, #00f59b 0%, #10b981 100%)' : '#374151',
                    color: user.isSelf ? 'var(--bg-primary)' : 'inherit'
                  }}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="col-user-name">
                    {user.name} {user.isSelf && '(You)'}
                  </span>
                </div>
                <span className="col-level col-level-val">{user.level}</span>
                <span className="col-streak col-streak-val">
                  <Flame size={12} style={{ display: 'inline', marginRight: 4 }} /> {user.streak}d
                </span>
                <span className="col-score col-score-val">{user.score}</span>
                <span className="col-saved col-saved-val">{user.saved.toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
