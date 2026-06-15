import React from 'react';
import { HelpCircle, AlertTriangle, Car, Utensils2, Zap, Trash2 } from 'lucide-react';

const EMISSION_FACTORS = {
  transport: { car_single: 12.0, car_pool: 6.0, metro: 1.5, ev: 0.8, cycle: 0.0 },
  diet: { meat_heavy: 8.0, meat_moderate: 4.5, vegetarian: 2.0, vegan: 0.8 },
  energy: { high: 9.0, medium: 5.0, low: 2.0, solar: 0.2 },
  waste: { none: 3.0, basic: 1.0, compost: 0.2 }
};

const CATEGORY_META = {
  transport: { title: 'Transport', icon: Car, color: '#ff4757', desc: 'Commuting profiles & vehicle emissions.' },
  diet: { title: 'Dietary habits', icon: Utensils2, color: '#ff9f43', desc: 'Agricultural land usage & meat logistics.' },
  energy: { title: 'Home Energy', icon: Zap, color: '#00f59b', desc: 'Grid reliance vs green solar offsets.' },
  waste: { title: 'Household Waste', icon: Trash2, color: '#6b7280', desc: 'Landfill methane releases from food waste.' }
};

export default function Breakdown({ habits, dailyFootprint }) {
  const transportVal = EMISSION_FACTORS.transport[habits.transport];
  const dietVal = EMISSION_FACTORS.diet[habits.diet];
  const energyVal = EMISSION_FACTORS.energy[habits.energy];
  const wasteVal = EMISSION_FACTORS.waste[habits.waste];
  
  const total = dailyFootprint;

  // Segment proportions for donut render
  const segments = [
    { key: 'transport', val: transportVal, color: '#ff4757', title: 'Transport Commute' },
    { key: 'diet', val: dietVal, color: '#ff9f43', title: 'Diet Pattern' },
    { key: 'energy', val: energyVal, color: '#00f59b', title: 'Grid Energy' },
    { key: 'waste', val: wasteVal, color: '#6b7280', title: 'Waste Output' }
  ];

  // Sort sectors by emission impact descending
  const sortedSectors = [...segments].sort((a, b) => b.val - a.val);
  const primarySector = sortedSectors[0];
  const primaryMeta = CATEGORY_META[primarySector.key];
  const primaryPerc = total > 0 ? Math.round((primarySector.val / total) * 100) : 0;

  // Donut circumference for r=60 is 2 * Math.PI * 60 = 377
  const circumference = 377;
  let accumulatedOffset = 0;

  return (
    <div className="breakdown-grid">
      
      {/* 1. Donut Visual Panel */}
      <div className="glass-card breakdown-visual-panel">
        <div className="card-header">
          <h3>Emission Category Proportions</h3>
          <span className="info-icon" title="Evaluates relative share of carbon emissions in your profile.">
            <HelpCircle size={16} />
          </span>
        </div>

        <div className="visuals-container">
          <div className="radial-ring-section">
            <div className="donut-chart-wrapper">
              <svg viewBox="0 0 160 160" className="donut-chart">
                <circle cx="80" cy="80" r="60" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="16"/>
                {segments.map((seg, idx) => {
                  const percentage = seg.val / (total || 1);
                  const strokeDash = percentage * circumference;
                  const strokeOffset = circumference - strokeDash + accumulatedOffset;
                  accumulatedOffset -= strokeDash;

                  return (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r="60"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                      strokeDashoffset={strokeOffset}
                      style={{ 
                        transformOrigin: 'center', 
                        transform: 'rotate(-90deg)', 
                        transition: 'stroke-dashoffset 0.8s ease' 
                      }}
                    />
                  );
                })}
              </svg>
              <div className="donut-center-text">
                <span className="total-co2">{total.toFixed(1)}</span>
                <span className="unit">kg CO₂/day</span>
              </div>
            </div>
          </div>

          <div className="breakdown-legend">
            {segments.map((seg, idx) => {
              const meta = CATEGORY_META[seg.key];
              const percentage = total > 0 ? Math.round((seg.val / total) * 100) : 0;
              return (
                <div key={idx} className="legend-item" title={meta.desc}>
                  <div className="legend-info">
                    <span className="legend-color-dot" style={{ background: seg.color }}></span>
                    <span className="legend-label">{meta.title} ({percentage}%)</span>
                  </div>
                  <span className="legend-value">{seg.val.toFixed(1)} kg</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Hotspot Panel */}
      <div className="glass-card hotspot-panel red-accent-border">
        <div className="badge-tag tag-alert">HOTSPOT CRITICAL</div>
        <div className="card-header">
          <h3>Primary Carbon Driver</h3>
          <span className="info-icon" title="The single component causing your highest carbon output currently.">
            <HelpCircle size={16} />
          </span>
        </div>

        <div className="hotspot-content">
          <div className="hotspot-hero">
            <div className="hotspot-symbol" style={{ 
              background: `rgba(${primarySector.key === 'transport' ? '255, 71, 87' : '255, 159, 67'}, 0.1)`,
              color: primarySector.color,
              border: `1px solid rgba(${primarySector.key === 'transport' ? '255, 71, 87' : '255, 159, 67'}, 0.25)`
            }}>
              <primaryMeta.icon size={26} />
            </div>
            <div className="hotspot-summary">
              <h4>{primarySector.title} Sector</h4>
              <p className="hotspot-impact-perc" style={{ color: primarySector.color }}>
                {primaryPerc}% of total footprint
              </p>
            </div>
          </div>

          <div className="hotspot-body">
            <p>
              {primarySector.key === 'transport' && 'Your travels in conventional solo petrol cars represent your largest pollution driver. Swapping to ridesharing, cycling short trips, or taking the metro rail cuts direct outputs drastically.'}
              {primarySector.key === 'diet' && 'Consuming meats frequently is highly carbon intensive due to agricultural methane outputs. Moving to local poultry or pure veg selections lowers this instantly.'}
              {primarySector.key === 'energy' && 'Running high-load air conditioning drawing coal-powered electricity is a primary bottleneck. Switching to fans or installing energy monitors will optimize usage.'}
              {primarySector.key === 'waste' && 'Dumping unsegregated household trash is the largest driver. Organic waste decomposes anaerobically in municipal landfills to leak raw methane. Separate and compost waste.'}
            </p>

            <div className="alert-box warn" style={{ background: 'rgba(255, 159, 67, 0.05)', border: '1px solid rgba(255, 159, 67, 0.15)', display: 'flex', gap: 12 }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-warn)', flexShrink: 0 }} />
              <span>
                <strong>Pro Tip:</strong> Urban Indian households adopting basic organic composting prevent average landfill decay equivalent to <strong>80 kg of CO₂</strong> annually.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Category Cards Grid (Apple Health details layout) */}
      <div className="glass-card categories-detail-panel col-span-2">
        <div className="card-header">
          <h3>Category Insights</h3>
          <span className="info-icon" title="Assessment overview of structural carbon components.">
            <HelpCircle size={16} />
          </span>
        </div>

        <div className="category-cards-grid">
          {segments.map((seg, idx) => {
            const meta = CATEGORY_META[seg.key];
            const IconComponent = meta.icon;
            
            return (
              <div key={idx} className="category-detail-card">
                <div className="cat-card-header">
                  <span className="cat-card-title">{meta.title}</span>
                  <div className="cat-card-icon" style={{ background: `rgba(${seg.key === 'transport' ? '255,71,87' : seg.key === 'diet' ? '255,159,67' : '0,245,155'}, 0.1)`, color: seg.color }}>
                    <IconComponent size={16} />
                  </div>
                </div>
                <span className="cat-card-value">{seg.val.toFixed(1)} kg</span>
                <p className="cat-card-desc">
                  {seg.key === 'transport' && 'Alternative: Metro transit saves 88% kg CO₂/km.'}
                  {seg.key === 'diet' && 'Alternative: Pulse protein cuts land usage footprint.'}
                  {seg.key === 'energy' && 'Alternative: Solar cells bypass peak load peaks.'}
                  {seg.key === 'waste' && 'Alternative: Separate bins halt high methane leaks.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
