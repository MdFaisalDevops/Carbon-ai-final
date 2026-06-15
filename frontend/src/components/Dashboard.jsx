import React, { useState } from 'react';
import { HelpCircle, Car, Utensils2, Zap, Trash2, Sparkles, ArrowRight } from 'lucide-react';

const EMISSION_FACTORS = {
  transport: { car_single: 12.0, car_pool: 6.0, metro: 1.5, ev: 0.8, cycle: 0.0 },
  diet: { meat_heavy: 8.0, meat_moderate: 4.5, vegetarian: 2.0, vegan: 0.8 },
  energy: { high: 9.0, medium: 5.0, low: 2.0, solar: 0.2 },
  waste: { none: 3.0, basic: 1.0, compost: 0.2 }
};

export default function Dashboard({ 
  habits, 
  onHabitChange, 
  score, 
  dailyFootprint, 
  level, 
  weeklySaved,
  setActiveScreen 
}) {
  const [trendPeriod, setTrendPeriod] = useState('weekly');

  // Gauge fill mathematics: circumference of arc path is 439.8
  const strokeOffset = 439.8 - (score / 1000) * 439.8;

  // Compile top 3 contributors
  const impactStats = [
    { name: 'Commute Profile', val: EMISSION_FACTORS.transport[habits.transport] },
    { name: 'Dietary Routine', val: EMISSION_FACTORS.diet[habits.diet] },
    { name: 'Home Electricity', val: EMISSION_FACTORS.energy[habits.energy] },
    { name: 'Household Waste', val: EMISSION_FACTORS.waste[habits.waste] }
  ].sort((a, b) => b.val - a.val);

  // Render SVG Trend data
  const trendData = trendPeriod === 'weekly' 
    ? [
        { label: 'Wk 1', val: 25 },
        { label: 'Wk 2', val: 32 },
        { label: 'Wk 3', val: 28 },
        { label: 'Wk 4', val: 38 },
        { label: 'Wk 5', val: 42 },
        { label: 'Wk 6', val: weeklySaved }
      ]
    : [
        { label: 'Jan', val: 95 },
        { label: 'Feb', val: 120 },
        { label: 'Mar', val: 110 },
        { label: 'Apr', val: 145 },
        { label: 'May', val: 170 },
        { label: 'Jun', val: Math.round(weeklySaved * 4.2) }
      ];

  const maxVal = Math.max(...trendData.map(d => d.val), 50);

  const applyRecommendation = () => {
    if (habits.transport === 'car_single') {
      onHabitChange('transport', 'metro');
    } else if (habits.transport === 'car_pool') {
      onHabitChange('transport', 'ev');
    }
  };

  return (
    <div className="dashboard-grid">
      
      {/* 1. Animated Score Gauge (Apple/Tesla Hybrid) */}
      <div className="glass-card score-panel">
        <div className="card-header">
          <h3>Carbon Impact Score</h3>
          <span className="info-icon" title="Carbon score ranges from 0 (poor) to 1000 (perfect). Starts at 1000, and is deducted by daily emissions.">
            <HelpCircle size={16} />
          </span>
        </div>

        <div className="gauge-wrapper">
          <svg className="score-gauge" viewBox="0 0 200 200" role="img" aria-label="Carbon Impact Score Gauge">
            <defs>
              <linearGradient id="gauge-grad-react" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4757" />
                <stop offset="50%" stopColor="#ff9f43" />
                <stop offset="100%" stopColor="#00f59b" />
              </linearGradient>
            </defs>
            <path 
              className="gauge-track" 
              d="M 30,170 A 80,80 0 1,1 170,170" 
              fill="none" 
              stroke="rgba(255,255,255,0.06)" 
              strokeWidth="14" 
              strokeLinecap="round"
            />
            <path 
              id="gauge-fill" 
              className="gauge-fill" 
              d="M 30,170 A 80,80 0 1,1 170,170" 
              fill="none" 
              stroke="url(#gauge-grad-react)" 
              strokeWidth="14" 
              strokeLinecap="round" 
              strokeDasharray="439.8" 
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <div className="gauge-content">
            <span className="score-display">{score}</span>
            <span className="level-pill" style={{ color: score > 600 ? 'var(--accent-neon)' : 'var(--accent-warn)' }}>
              {level}
            </span>
          </div>
        </div>

        <div className="score-footer">
          <div className="metric-item">
            <span className="label">Daily Footprint</span>
            <span className="value">{dailyFootprint.toFixed(1)} kg CO₂</span>
          </div>
          <div className="divider"></div>
          <div className="metric-item">
            <span className="label">Indian Urban Avg</span>
            <span className="value">28.5 kg CO₂</span>
          </div>
        </div>
      </div>

      {/* 2. Habits Controller */}
      <div className="glass-card habits-panel">
        <div className="card-header">
          <h3>Habit Modifiers</h3>
          <span className="info-icon" title="Simulate carbon footprint variations by adjusting your lifestyle parameters.">
            <HelpCircle size={16} />
          </span>
        </div>
        <p className="panel-subtitle">Configure your routine to optimize emissions</p>

        <div className="habits-list">
          {/* Commute */}
          <div className="habit-row">
            <div className="habit-desc">
              <div className="habit-icon-wrapper"><Car size={18} /></div>
              <div className="habit-details">
                <span className="habit-title">Daily Commute</span>
                <span className="habit-subtitle">
                  {habits.transport === 'car_single' && 'Solo Petrol Car'}
                  {habits.transport === 'car_pool' && 'Car Pool / Shared Uber'}
                  {habits.transport === 'metro' && 'Metro Rail'}
                  {habits.transport === 'ev' && 'Electric Vehicle'}
                  {habits.transport === 'cycle' && 'Cycle / Walk / WFH'}
                </span>
              </div>
            </div>
            <div className="habit-control">
              <select 
                value={habits.transport} 
                onChange={(e) => onHabitChange('transport', e.target.value)}
                className="form-select"
                aria-label="Daily Commute Option"
              >
                <option value="car_single">Solo Petrol Car</option>
                <option value="car_pool">Car Pool / Ride Share</option>
                <option value="metro">Metro Transit</option>
                <option value="ev">Electric Car (EV)</option>
                <option value="cycle">Cycle / Walking / WFH</option>
              </select>
            </div>
          </div>

          {/* Diet */}
          <div className="habit-row">
            <div className="habit-desc">
              <div className="habit-icon-wrapper"><Utensils2 size={18} /></div>
              <div className="habit-details">
                <span className="habit-title">Dietary Pattern</span>
                <span className="habit-subtitle">
                  {habits.diet === 'meat_heavy' && 'Frequent Red Meat'}
                  {habits.diet === 'meat_moderate' && 'Balanced Meat/Poultry'}
                  {habits.diet === 'vegetarian' && 'Pure Vegetarian'}
                  {habits.diet === 'vegan' && 'Plant-Based / Vegan'}
                </span>
              </div>
            </div>
            <div className="habit-control">
              <select 
                value={habits.diet} 
                onChange={(e) => onHabitChange('diet', e.target.value)}
                className="form-select"
                aria-label="Dietary Pattern Option"
              >
                <option value="meat_heavy">Frequent Red Meat</option>
                <option value="meat_moderate">Balanced Meat</option>
                <option value="vegetarian">Pure Vegetarian</option>
                <option value="vegan">Plant-Based / Vegan</option>
              </select>
            </div>
          </div>

          {/* Energy */}
          <div className="habit-row">
            <div className="habit-desc">
              <div className="habit-icon-wrapper"><Zap size={18} /></div>
              <div className="habit-details">
                <span className="habit-title">AC / Electricity</span>
                <span className="habit-subtitle">
                  {habits.energy === 'high' && 'High (>8 hrs AC/day)'}
                  {habits.energy === 'medium' && 'Medium (3-8 hrs AC/day)'}
                  {habits.energy === 'low' && 'Low (<3 hrs AC/day)'}
                  {habits.energy === 'solar' && 'Solar / Off-grid'}
                </span>
              </div>
            </div>
            <div className="habit-control">
              <select 
                value={habits.energy} 
                onChange={(e) => onHabitChange('energy', e.target.value)}
                className="form-select"
                aria-label="AC / Electricity Option"
              >
                <option value="high">High (>8 hrs AC)</option>
                <option value="medium">Medium (3-8 hrs AC)</option>
                <option value="low">Low (<3 hrs AC)</option>
                <option value="solar">Solar-powered</option>
              </select>
            </div>
          </div>

          {/* Waste */}
          <div className="habit-row">
            <div className="habit-desc">
              <div className="habit-icon-wrapper"><Trash2 size={18} /></div>
              <div className="habit-details">
                <span className="habit-title">Waste Segregation</span>
                <span className="habit-subtitle">
                  {habits.waste === 'none' && 'No separation'}
                  {habits.waste === 'basic' && 'Dry & Wet segregated'}
                  {habits.waste === 'compost' && 'Zero Single-Use / Composted'}
                </span>
              </div>
            </div>
            <div className="habit-control">
              <select 
                value={habits.waste} 
                onChange={(e) => onHabitChange('waste', e.target.value)}
                className="form-select"
                aria-label="Waste Segregation Option"
              >
                <option value="none">No separation</option>
                <option value="basic">Dry & Wet split</option>
                <option value="compost">Compost & zero plastic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI recommendation */}
      <div className="glass-card recommendation-card green-accent-border">
        <div className="badge-tag">AI STRATEGIST</div>
        <h3>Recommendation of the Day</h3>
        <div className="rec-body">
          <p className="rec-text">
            {habits.transport === 'car_single' 
              ? 'Upgrade your daily commute from solo petrol driving to Metro rail or EV. By making this transition, you will prevent approximately 340 kg of CO₂ annually, boosting your Carbon Score by +180 points.'
              : habits.diet === 'meat_heavy'
              ? 'Try substituting high-carbon red meats with local lentils or poultry. A simple diet swap 3 times a week prevents up to 120 kg of carbon releases annually.'
              : 'Keep up the sustainable patterns! To squeeze out more points, optimize home standby power grids or install smart window tints to reduce active cooling loss.'
            }
          </p>
          <div className="action-buttons-row">
            {['car_single', 'car_pool'].includes(habits.transport) && (
              <button onClick={applyRecommendation} className="btn btn-primary btn-sm">
                <Sparkles size={14} /> Try this adjustment
              </button>
            )}
            <button onClick={() => setActiveScreen('coach')} className="btn btn-secondary btn-sm">
              Ask AI Coach <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Top Impact Habits */}
      <div className="glass-card habits-summary-panel">
        <div className="card-header">
          <h3>Top Impact Habits</h3>
          <span className="info-icon" title="Lifestyle routines generating the largest carbon footprints.">
            <HelpCircle size={16} />
          </span>
        </div>
        <ul className="impact-habits-list">
          {impactStats.slice(0, 3).map((item, index) => {
            let severity = 'low-impact';
            if (item.val > 7.0) severity = 'high-impact';
            else if (item.val > 3.0) severity = 'medium-impact';

            return (
              <li key={index} className={`impact-habit-item ${severity}`}>
                <div className="legend-info">
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)', marginRight: 8 }}>#{index + 1}</span>
                  <span className="impact-habit-name">{item.name}</span>
                </div>
                <span className="impact-habit-value">{item.val.toFixed(1)} kg CO₂/day</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 5. SVG Savings Line Chart (Apple Health telemetry) */}
      <div className="glass-card trend-panel col-span-2">
        <div className="card-header-row">
          <div className="card-header">
            <h3>Carbon Savings Trend</h3>
            <span className="info-icon" title="Shows accumulated carbon savings index comparison against baseline metrics.">
              <HelpCircle size={16} />
            </span>
          </div>
          <div className="trend-tabs">
            <button 
              className={`trend-tab ${trendPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setTrendPeriod('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`trend-tab ${trendPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setTrendPeriod('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="chart-container">
          <svg viewBox="0 0 600 180" width="100%" height="180">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((g, idx) => {
              const yVal = 20 + (130 / 4) * idx;
              const lbl = Math.round(maxVal - (maxVal / 4) * idx);
              return (
                <g key={idx}>
                  <line 
                    x1="40" y1={yVal} x2="580" y2={yVal} 
                    className="chart-grid-line" 
                    stroke="rgba(255,255,255,0.06)" 
                    strokeWidth="1"
                  />
                  <text x="30" y={yVal + 4} textAnchor="end" className="chart-label" style={{ fontSize: 10, fill: 'var(--text-muted)' }}>
                    {lbl}
                  </text>
                </g>
              );
            })}

            {/* Bars and Line dots */}
            {trendData.map((d, idx) => {
              const spacing = 540 / trendData.length;
              const x = 40 + spacing * idx + spacing / 2;
              const y = 20 + 130 - (d.val / maxVal) * 130;
              const isLast = idx === trendData.length - 1;

              return (
                <g key={idx}>
                  <rect 
                    x={x - 16} 
                    y={y} 
                    width="32" 
                    height={150 - y} 
                    rx="4" 
                    fill="var(--accent-neon)" 
                    opacity={isLast ? 0.85 : 0.15}
                    className="chart-bar"
                  >
                    <title>Savings: {d.val} kg</title>
                  </rect>
                  <text x={x} y="170" textAnchor="middle" className="chart-label" style={{ fontSize: 10, fill: 'var(--text-muted)' }}>
                    {d.label}
                  </text>
                  {/* Circle points on grid */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="var(--bg-primary)" 
                    stroke="var(--accent-neon)" 
                    strokeWidth="2"
                  >
                    <title>{d.val} kg saved</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

    </div>
  );
}
