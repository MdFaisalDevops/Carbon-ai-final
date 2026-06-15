import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Breakdown from './components/Breakdown';
import AICoach from './components/AICoach';
import Gamification from './components/Gamification';
import { Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

// Base factors matching backend logic
const EMISSION_FACTORS = {
  transport: { car_single: 12.0, car_pool: 6.0, metro: 1.5, ev: 0.8, cycle: 0.0 },
  diet: { meat_heavy: 8.0, meat_moderate: 4.5, vegetarian: 2.0, vegan: 0.8 },
  energy: { high: 9.0, medium: 5.0, low: 2.0, solar: 0.2 },
  waste: { none: 3.0, basic: 1.0, compost: 0.2 }
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [habits, setHabits] = useState({
    transport: 'car_single',
    diet: 'meat_heavy',
    energy: 'high',
    waste: 'none'
  });
  
  const [userScore, setUserScore] = useState(550);
  const [dailyFootprint, setDailyFootprint] = useState(14.2);
  const [weeklySaved, setWeeklySaved] = useState(48.2);
  const [userLevel, setUserLevel] = useState('Eco Beginner');
  const [streakDays, setStreakDays] = useState(12);

  // Sync state to API (if backend is active)
  const syncWithBackend = async (scoreVal, levelVal, savedVal) => {
    try {
      await fetch('http://localhost:10000/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user_self',
          carbon_score: scoreVal,
          level: levelVal,
          badges: [], // will calculate on server or submit
          weekly_co2_saved: savedVal,
          streak_days: streakDays
        })
      });
    } catch (e) {
      // Local deployment is off or unreachable, bypass silently
    }
  };

  // Run scoring calculations on habits modify
  useEffect(() => {
    const transportVal = EMISSION_FACTORS.transport[habits.transport];
    const dietVal = EMISSION_FACTORS.diet[habits.diet];
    const energyVal = EMISSION_FACTORS.energy[habits.energy];
    const wasteVal = EMISSION_FACTORS.waste[habits.waste];

    const footprint = transportVal + dietVal + energyVal + wasteVal;
    setDailyFootprint(footprint);

    let calculatedScore = Math.round(1000 - (footprint * 20));
    calculatedScore = Math.max(0, Math.min(1000, calculatedScore));

    // Handle confetti and toast notifications if score improved
    if (calculatedScore > userScore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.9 },
        colors: ['#00f59b', '#10b981', '#ffffff']
      });
    }

    setUserScore(calculatedScore);

    // Calculate Standing Levels
    let standing = 'Eco Beginner';
    if (calculatedScore <= 300) standing = 'High Impact User';
    else if (calculatedScore <= 600) standing = 'Eco Beginner';
    else if (calculatedScore <= 750) standing = 'Conscious User';
    else if (calculatedScore <= 900) standing = 'Balanced User';
    else standing = 'Green Optimizer';

    setUserLevel(standing);

    // Calculate weekly savings compared to baseline (32 kg CO2)
    const baselineWeekly = 32.0 * 7;
    const currentWeekly = footprint * 7;
    const saved = Math.max(0, baselineWeekly - currentWeekly);
    const parsedSaved = parseFloat(saved.toFixed(1));
    setWeeklySaved(parsedSaved);

    // Run backend sync
    syncWithBackend(calculatedScore, standing, parsedSaved);

  }, [habits]);

  const handleHabitChange = (category, value) => {
    setHabits(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="glow-orb glow-1"></div>
      <div className="glow-orb glow-2"></div>

      <Navbar 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        userLevel={userLevel} 
      />

      <main className="main-viewport">
        {/* Dynamic header details */}
        <header className="top-bar">
          <div className="screen-title-area">
            <h1 className="screen-title" style={{ textTransform: 'capitalize' }}>
              {activeScreen === 'gamification' ? 'Eco Level' : activeScreen}
            </h1>
            <p className="screen-subtitle">
              {activeScreen === 'dashboard' && 'Your real-time carbon intelligence overview.'}
              {activeScreen === 'breakdown' && 'In-depth assessment of emission contributors.'}
              {activeScreen === 'coach' && 'Personalized mitigation strategy session.'}
              {activeScreen === 'gamification' && 'Compete, earn badges, and build positive streaks.'}
            </p>
          </div>

          <div className="header-widgets">
            <div className="widget-chip green-glow" title="Saved compared to baseline this week">
              <Sparkles size={16} />
              <span>Saved <strong>{weeklySaved}</strong> kg CO₂</span>
            </div>

            <div className="widget-chip streak-chip" title="Active Daily Streak">
              <Flame size={16} className="streak-icon" />
              <span><strong>{streakDays}</strong> Day Streak</span>
            </div>
          </div>
        </header>

        {/* Content View Switching */}
        <div className="screens-container">
          {activeScreen === 'dashboard' && (
            <Dashboard 
              habits={habits} 
              onHabitChange={handleHabitChange}
              score={userScore}
              dailyFootprint={dailyFootprint}
              level={userLevel}
              weeklySaved={weeklySaved}
              setActiveScreen={setActiveScreen}
            />
          )}

          {activeScreen === 'breakdown' && (
            <Breakdown 
              habits={habits}
              dailyFootprint={dailyFootprint}
            />
          )}

          {activeScreen === 'coach' && (
            <AICoach 
              habits={habits}
              personality={userLevel}
              dailyFootprint={dailyFootprint}
            />
          )}

          {activeScreen === 'gamification' && (
            <Gamification 
              score={userScore}
              level={userLevel}
              streakDays={streakDays}
              weeklySaved={weeklySaved}
              habits={habits}
            />
          )}
        </div>
      </main>
    </div>
  );
}
