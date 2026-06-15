/* -------------------------------------------------------------
 * CarbonMind AI Core Application Engine
 * Contains: State, Routing, Calculations, Charts, AI Coach, 
 *           Leaderboard, and Confetti Systems.
 * ------------------------------------------------------------- */

// Global State
const state = {
  activeScreen: 'dashboard',
  user: {
    name: 'Arjun Mehta',
    streakDays: 12,
    weeklySaved: 48.2, // in kg
    habits: {
      transport: 'car_single',
      diet: 'meat_heavy',
      energy: 'high',
      waste: 'none'
    },
    score: 0,
    dailyFootprint: 0,
    personality: 'Eco Beginner',
    level: 'Eco Beginner'
  },
  leaderboard: [
    { name: 'Kunal Shah', score: 920, level: 'Green Optimizer', streak: 28, saved: 85.4, isSelf: false },
    { name: 'Priya Sharma', score: 810, level: 'Balanced User', streak: 15, saved: 62.1, isSelf: false },
    { name: 'Arjun Mehta', score: 550, level: 'Eco Beginner', streak: 12, saved: 48.2, isSelf: true }, // will update dynamically
    { name: 'Amit Patel', score: 510, level: 'Eco Beginner', streak: 4, saved: 29.5, isSelf: false },
    { name: 'Neha Gupta', score: 340, level: 'Eco Beginner', streak: 2, saved: 12.0, isSelf: false }
  ],
  badges: [
    { id: 'low_car', name: 'Low Car Hero', icon: 'car', hint: 'Select Metro, EV, or cycle commute', unlocked: false },
    { id: 'plant_based', name: 'Plant-Based Week', icon: 'utensils-2', hint: 'Select vegetarian or vegan diet', unlocked: false },
    { id: 'energy_saver', name: 'Energy Saver', icon: 'zap', hint: 'Reduce AC usage to low or solar energy', unlocked: false },
    { id: 'zero_waste', name: 'Zero Waste Day', icon: 'trash-2', hint: 'Compost waste & separate dry/wet', unlocked: false },
    { id: 'streak', name: 'Consistency Streak', icon: 'flame', hint: 'Achieve a 10-day streak of eco habits', unlocked: true } // starts unlocked
  ],
  trendPeriod: 'weekly'
};

// Coefficient matrices (Daily emissions in kg CO2 per day)
const EMISSION_FACTORS = {
  transport: {
    car_single: 12.0,
    car_pool: 6.0,
    metro: 1.5,
    ev: 0.8,
    cycle: 0.0
  },
  diet: {
    meat_heavy: 8.0,
    meat_moderate: 4.5,
    vegetarian: 2.0,
    vegan: 0.8
  },
  energy: {
    high: 9.0,
    medium: 5.0,
    low: 2.0,
    solar: 0.2
  },
  waste: {
    none: 3.0,
    basic: 1.0,
    compost: 0.2
  }
};

// Help-text parameters (tooltip explanations)
const CATEGORY_META = {
  transport: {
    title: 'Transportation',
    icon: 'car',
    color: '#ff4757',
    description: 'Based on distance commuted and vehicle emission coefficients.'
  },
  diet: {
    title: 'Dietary Habits',
    icon: 'utensils-2',
    color: '#ff9f43',
    description: 'Calculates structural food footprint including meat logistics.'
  },
  energy: {
    title: 'Home Energy',
    icon: 'zap',
    color: '#00f59b',
    description: 'Evaluates carbon intensity of grid power vs green solar sources.'
  },
  waste: {
    title: 'Waste Management',
    icon: 'trash-2',
    color: '#6b7280',
    description: 'Estimates methane footprint from organic wastes landing in landfills.'
  }
};

// Predefined coach responses matching the Master AI Coach JSON structure
const SIMULATED_COACH_RESPONSES = {
  ac_bangalore: {
    "carbon_personality_type": "High Impact Consumer",
    "total_footprint_estimate": "9.0 kg CO₂/day from AC operations",
    "impact_hotspots": ["AC runtimes exceeding 8 hours/day", "Coal-heavy grid energy in Karnataka"],
    "top_3_actions": [
      {
        "action": "Increase AC Setpoint to 24°C & engage Ceiling Fan",
        "why_it_matters": "Every 1°C increase saves 6% electricity. Combining with a fan matches the cooling feel of 21°C at a fraction of the power.",
        "co2_saving_estimate": "2.2 kg CO₂ saved daily",
        "effort_level": "low"
      },
      {
        "action": "Use AC Timer and auto-shutoff at 4:00 AM",
        "why_it_matters": "Bangalore nights drop to comfortable temperatures. Running AC until dawn wastes energy during sleep when ambient air is cool.",
        "co2_saving_estimate": "3.5 kg CO₂ saved daily",
        "effort_level": "low"
      },
      {
        "action": "Install thermal curtains on West-facing windows",
        "why_it_matters": "Reduces solar heat gain, preventing the AC compressor from running at peak load during afternoon heat spikes.",
        "co2_saving_estimate": "1.8 kg CO₂ saved daily",
        "effort_level": "medium"
      }
    ],
    "micro_actions": [
      "Clean AC filters bi-weekly to improve efficiency by 15%",
      "Seal door/window gaps using rubber strips to prevent cold air leaks"
    ],
    "future_projection_30_days": "Transitioning to 24°C + timer saves 171 kg CO₂ over 30 days (equivalent to planting 8 trees).",
    "motivational_insight": "In Bangalore's moderate climate, smart ventilation and fan usage can cut cooling carbon footprint by up to 50% without compromising comfort."
  },
  indian_diet: {
    "carbon_personality_type": "Conscious Commuter",
    "total_footprint_estimate": "8.0 kg CO₂/day from heavy meat dietary habits",
    "impact_hotspots": ["Frequent mutton and beef intake", "High dairy consumption (paneer/ghee imports)"],
    "top_3_actions": [
      {
        "action": "Switch from Red Meat to Poultry or Fish",
        "why_it_matters": "Mutton/beef production has a carbon footprint 5x higher than poultry, demanding intensive land and feed resources.",
        "co2_saving_estimate": "4.2 kg CO₂ saved per meal replaced",
        "effort_level": "medium"
      },
      {
        "action": "Integrate local Indian Millets (Ragi/Jowar) as carb base",
        "why_it_matters": "Millets require 10x less water than rice and are resilient crops, offering high nutrition with minimal ecological strain.",
        "co2_saving_estimate": "1.1 kg CO₂ saved daily",
        "effort_level": "low"
      },
      {
        "action": "Establish 3 Plant-based days weekly",
        "why_it_matters": "Swapping dairy/meat for dals and local vegetables significantly reduces agricultural greenhouse emissions.",
        "co2_saving_estimate": "3.5 kg CO₂ saved weekly",
        "effort_level": "low"
      }
    ],
    "micro_actions": [
      "Purchase seasonal, locally-grown vegetables to bypass long-distance transport emissions",
      "Avoid food waste; organic kitchen waste decomposing in garbage piles releases methane"
    ],
    "future_projection_30_days": "Replacing mutton with lentils/chicken 4 times a week cuts 96 kg CO₂ in a month.",
    "motivational_insight": "Traditional Indian vegetarian diets are structurally among the lowest carbon profiles globally. Reclaiming local pulses and millets is the perfect eco-action."
  },
  uber_share: {
    "carbon_personality_type": "Eco Beginner",
    "total_footprint_estimate": "12.0 kg CO₂/day in single-occupant petrol vehicle",
    "impact_hotspots": ["Solo travel during peak hour gridlocks", "High idling fuel loss in bumper-to-bumper city traffic"],
    "top_3_actions": [
      {
        "action": "Use Ride-Sharing (Uber Share) or Car Pools",
        "why_it_matters": "Distributes vehicle operation carbon cost across multiple passengers, cutting your direct share of travel emissions in half.",
        "co2_saving_estimate": "6.0 kg CO₂ saved per commute",
        "effort_level": "low"
      },
      {
        "action": "Switch to Metro Rail for commutes exceeding 10 km",
        "why_it_matters": "Electric rapid transit systems avoid traffic delays entirely, utilizing high-occupancy mass-efficiency to bypass vehicle idling.",
        "co2_saving_estimate": "10.5 kg CO₂ saved per trip",
        "effort_level": "medium"
      },
      {
        "action": "Adopt Electric Vehicles (EV) for daily driving",
        "why_it_matters": "EVs eliminate tailpipe emissions completely and are highly efficient in stop-and-go urban traffic conditions.",
        "co2_saving_estimate": "11.2 kg CO₂ saved daily",
        "effort_level": "high"
      }
    ],
    "micro_actions": [
      "Turn off the engine during traffic light stops exceeding 15 seconds to eliminate idling emissions",
      "Ensure proper tire pressure to optimize fuel efficiency by 3-4%"
    ],
    "future_projection_30_days": "Commuting via Metro instead of a solo car saves 240 kg CO₂ over 30 days.",
    "motivational_insight": "An average Indian urban commuter spends 1.5 hours in traffic daily. Switching to public transit not only slashes carbon but also reduces personal travel fatigue."
  },
  waste_segregation: {
    "carbon_personality_type": "Balanced Lifestyle User",
    "total_footprint_estimate": "3.0 kg CO₂/day from unsegregated trash disposal",
    "impact_hotspots": ["Methane emissions from anaerobic decomposition of wet waste in landfills"],
    "top_3_actions": [
      {
        "action": "Separate Wet and Dry Wastes",
        "why_it_matters": "Dry recyclables (paper, plastic, metals) can be safely processed, while wet waste is diverted from methane-producing dump piles.",
        "co2_saving_estimate": "1.2 kg CO₂ saved daily",
        "effort_level": "low"
      },
      {
        "action": "Set up a Home/Community Compost Bin",
        "why_it_matters": "Aerobic composting of organic food scraps converts organic material into rich nutrient compost without generating methane.",
        "co2_saving_estimate": "1.6 kg CO₂ saved daily",
        "effort_level": "medium"
      },
      {
        "action": "Avoid Single-use Plastics and Packages",
        "why_it_matters": "Plastics carry high manufacturing footprints and clog recycling systems. Opt for reusables during grocery runs.",
        "co2_saving_estimate": "0.8 kg CO₂ saved daily",
        "effort_level": "low"
      }
    ],
    "micro_actions": [
      "Rinse plastic containers before throwing to prevent contamination of dry waste",
      "Refuse single-use cutlery when ordering food delivery"
    ],
    "future_projection_30_days": "Diverting wet waste to home composting prevents 48 kg CO₂ equivalent emissions in a month.",
    "motivational_insight": "Waste management represents a critical loop. By turning organic waste into fertilizer, you transition from a consumer to a regenerator."
  }
};

// Initial setup on load
document.addEventListener('DOMContentLoaded', () => {
  initRouting();
  initHabitListeners();
  initTrendCharts();
  initCoachListeners();
  initTooltips();
  
  // Calculate initial carbon score and render components
  calculateAndUpdateScore(false);
  lucide.createIcons();
});

// -------------------------------------------------------------
// NAVIGATION & ROUTING
// -------------------------------------------------------------
function initRouting() {
  const navItems = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen');
  const screenTitle = document.getElementById('screen-title');
  const screenSubtitle = document.getElementById('screen-subtitle');
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.querySelector('.sidebar');

  function switchScreen(screenId) {
    state.activeScreen = screenId;
    
    // Manage active states of navigation elements
    navItems.forEach(item => {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle visible screens
    screens.forEach(screen => {
      if (screen.id === `${screenId}-screen`) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    // Update Top Header titles
    switch (screenId) {
      case 'dashboard':
        screenTitle.innerText = 'Dashboard';
        screenSubtitle.innerText = 'Your real-time carbon intelligence overview.';
        renderTrendChart();
        renderTopImpactList();
        break;
      case 'breakdown':
        screenTitle.innerText = 'Lifestyle Breakdown';
        screenSubtitle.innerText = 'In-depth assessment of emission contributors.';
        renderBreakdownScreen();
        break;
      case 'coach':
        screenTitle.innerText = 'AI Carbon Coach';
        screenSubtitle.innerText = 'Personalized mitigation strategy session.';
        renderCoachScreen();
        break;
      case 'gamification':
        screenTitle.innerText = 'Eco Ranks & Badges';
        screenSubtitle.innerText = 'Compete, earn badges, and build positive streaks.';
        renderGamificationScreen();
        break;
    }

    // Scroll viewport back to top
    document.querySelector('.main-viewport').scrollTop = 0;
  }

  // Hook desktop click events
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScreen = item.getAttribute('data-screen');
      switchScreen(targetScreen);
      
      // Close mobile drawer if active
      if (window.innerWidth <= 768) {
        sidebar.style.display = 'none';
      }
    });
  });

  // Recommendation action routes
  const applyRecBtn = document.getElementById('apply-rec-btn');
  if (applyRecBtn) {
    applyRecBtn.addEventListener('click', () => {
      // Simulate choosing better transport commute
      const transportSelect = document.getElementById('habit-transport');
      if (transportSelect.value === 'car_single') {
        transportSelect.value = 'metro';
        triggerSelectChange(transportSelect);
      } else if (transportSelect.value === 'car_pool') {
        transportSelect.value = 'ev';
        triggerSelectChange(transportSelect);
      } else {
        showToast('You already have a green transit setting active!', 'info');
      }
    });
  }

  const coachRedirectBtn = document.getElementById('coach-redirect-btn');
  if (coachRedirectBtn) {
    coachRedirectBtn.addEventListener('click', () => {
      switchScreen('coach');
    });
  }

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (sidebar.style.display === 'flex') {
        sidebar.style.display = 'none';
      } else {
        sidebar.style.display = 'flex';
      }
    });
  }

  // Handle URL hashes if users reload
  const currentHash = window.location.hash.replace('#', '');
  if (['dashboard', 'breakdown', 'coach', 'gamification'].includes(currentHash)) {
    switchScreen(currentHash);
  }
}

function triggerSelectChange(element) {
  const event = new Event('change');
  element.dispatchEvent(event);
}

// -------------------------------------------------------------
// HABIT CONTROLLER & CALCULATOR ENGINE
// -------------------------------------------------------------
function initHabitListeners() {
  const selects = ['habit-transport', 'habit-diet', 'habit-energy', 'habit-waste'];
  
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const key = id.replace('habit-', '');
        const val = e.target.value;
        
        // Save previous score for delta notifications
        const prevScore = state.user.score;
        
        // Update state
        state.user.habits[key] = val;
        
        // Update description labels
        updateSubtitles();
        
        // Recalculate score and update visuals
        calculateAndUpdateScore(true, prevScore);
      });
    }
  });
}

function updateSubtitles() {
  const transText = {
    car_single: 'Car (Single Occupant)',
    car_pool: 'Car Pool / Shared Taxi',
    metro: 'Metro Rail transit',
    ev: 'Electric Vehicle (EV)',
    cycle: 'Cycle / Walking / WFH'
  };
  const dietText = {
    meat_heavy: 'Frequent Red Meat',
    meat_moderate: 'Balanced Meat/Poultry',
    vegetarian: 'Pure Vegetarian',
    vegan: 'Plant-Based / Vegan'
  };
  const energyText = {
    high: 'High (>8 hrs AC/day)',
    medium: 'Medium (3-8 hrs AC/day)',
    low: 'Low (<3 hrs AC/day)',
    solar: 'Solar-powered / Off-grid'
  };
  const wasteText = {
    none: 'No separation, high single-use',
    basic: 'Dry & Wet separated',
    compost: 'Composting & Zero single-use'
  };

  document.getElementById('transport-subtitle').innerText = transText[state.user.habits.transport];
  document.getElementById('diet-subtitle').innerText = dietText[state.user.habits.diet];
  document.getElementById('energy-subtitle').innerText = energyText[state.user.habits.energy];
  document.getElementById('waste-subtitle').innerText = wasteText[state.user.habits.waste];
}

function calculateAndUpdateScore(triggerEffects = false, prevScore = 0) {
  const habits = state.user.habits;
  
  // Calculate daily footprint in kg CO2
  const transportVal = EMISSION_FACTORS.transport[habits.transport];
  const dietVal = EMISSION_FACTORS.diet[habits.diet];
  const energyVal = EMISSION_FACTORS.energy[habits.energy];
  const wasteVal = EMISSION_FACTORS.waste[habits.waste];
  
  const dailyFootprint = transportVal + dietVal + energyVal + wasteVal;
  state.user.dailyFootprint = dailyFootprint;
  
  // Score formula: starts at 1000 and drops linearly by footprint
  // Perfect score = ~1000 (around 1.2 kg CO2), worst is ~360 (32 kg CO2)
  let rawScore = Math.round(1000 - (dailyFootprint * 20));
  rawScore = Math.max(0, Math.min(1000, rawScore));
  
  state.user.score = rawScore;
  
  // Define eco level
  let level = 'Eco Beginner';
  if (rawScore <= 300) level = 'High Impact User';
  else if (rawScore <= 600) level = 'Eco Beginner';
  else if (rawScore <= 750) level = 'Conscious User';
  else if (rawScore <= 900) level = 'Balanced User';
  else level = 'Green Optimizer';
  
  state.user.level = level;
  state.user.personality = level;

  // Calculate dynamic weekly savings based on a default baseline (32 kg CO2/day)
  const baselineWeekly = 32.0 * 7;
  const currentWeekly = dailyFootprint * 7;
  const weeklySaved = Math.max(0, baselineWeekly - currentWeekly);
  state.user.weeklySaved = parseFloat(weeklySaved.toFixed(1));

  // Sync user info into the leaderboard list
  const selfRow = state.leaderboard.find(u => u.isSelf);
  if (selfRow) {
    selfRow.score = rawScore;
    selfRow.level = level;
    selfRow.saved = state.user.weeklySaved;
  }
  
  // Update badge unlock logic
  updateBadgesStatus();

  // Render text readouts
  animateTextCounter('score-text', prevScore, rawScore, 1000);
  document.getElementById('daily-footprint-text').innerText = `${dailyFootprint.toFixed(1)} kg CO₂`;
  document.getElementById('weekly-saved-val').innerText = state.user.weeklySaved;
  
  const levelBadge = document.getElementById('level-badge');
  if (levelBadge) {
    levelBadge.innerText = level;
    // Adapt color based on level
    if (rawScore <= 300) levelBadge.style.color = 'var(--accent-alert)';
    else if (rawScore <= 600) levelBadge.style.color = 'var(--accent-warn)';
    else levelBadge.style.color = 'var(--accent-neon)';
  }

  // Update SVG score dial
  updateGaugeDial(rawScore);

  // Trigger feedback animations if score has improved
  if (triggerEffects && rawScore !== prevScore) {
    const delta = rawScore - prevScore;
    if (delta > 0) {
      showToast(`Carbon Score Increased! +${delta} pts`, 'success');
      launchConfetti();
    } else {
      showToast(`Carbon Score Decreased! ${delta} pts`, 'warning');
    }
    
    // Refresh background components if on dashboard
    if (state.activeScreen === 'dashboard') {
      renderTopImpactList();
    }
  }
}

// Animate numbers from start to target values smoothly
function animateTextCounter(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;
  
  const range = end - start;
  if (range === 0) {
    obj.innerText = end;
    return;
  }
  
  let startTime = null;
  
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    obj.innerText = Math.floor(progress * range + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerText = end;
    }
  }
  window.requestAnimationFrame(step);
}

// Adjust circular gauge dashoffset
function updateGaugeDial(score) {
  const fillPath = document.getElementById('gauge-fill');
  if (!fillPath) return;
  
  // Outer arc length is 439.8
  // Max score is 1000. Math: fill proportion matches score / 1000
  const totalLength = 439.8;
  const dashoffset = totalLength - (score / 1000) * totalLength;
  
  fillPath.style.strokeDashoffset = dashoffset;
}

// -------------------------------------------------------------
// DYNAMIC COMPONENT RENDERING
// -------------------------------------------------------------
function renderTopImpactList() {
  const habits = state.user.habits;
  const listEl = document.getElementById('top-impact-habits');
  if (!listEl) return;
  
  // Map habits to daily carbon rates
  const mapped = [
    { name: 'Commute Profile', key: 'transport', val: EMISSION_FACTORS.transport[habits.transport] },
    { name: 'Dietary Routine', key: 'diet', val: EMISSION_FACTORS.diet[habits.diet] },
    { name: 'Home Electricity', key: 'energy', val: EMISSION_FACTORS.energy[habits.energy] },
    { name: 'Household Waste', key: 'waste', val: EMISSION_FACTORS.waste[habits.waste] }
  ];
  
  // Sort descending by highest carbon contributors
  mapped.sort((a, b) => b.val - a.val);
  
  listEl.innerHTML = '';
  // Show top 3 contributors
  mapped.slice(0, 3).forEach((item, index) => {
    const li = document.createElement('li');
    let impactClass = 'low-impact';
    if (item.val > 7.0) impactClass = 'high-impact';
    else if (item.val > 3.0) impactClass = 'medium-impact';
    
    li.className = `impact-habit-item ${impactClass}`;
    li.innerHTML = `
      <div class="legend-info">
        <span style="font-weight:700; color:var(--text-muted); margin-right:8px;">#${index+1}</span>
        <span class="impact-habit-name">${item.name}</span>
      </div>
      <span class="impact-habit-value">${item.val.toFixed(1)} kg CO₂/day</span>
    `;
    listEl.appendChild(li);
  });
}

// Dynamic rendering for Breakdown Page elements
function renderBreakdownScreen() {
  const habits = state.user.habits;
  const transportVal = EMISSION_FACTORS.transport[habits.transport];
  const dietVal = EMISSION_FACTORS.diet[habits.diet];
  const energyVal = EMISSION_FACTORS.energy[habits.energy];
  const wasteVal = EMISSION_FACTORS.waste[habits.waste];
  const total = transportVal + dietVal + energyVal + wasteVal;
  
  document.getElementById('donut-total-val').innerText = total.toFixed(1);
  
  // Donut values allocation
  const segments = [
    { id: 'donut-transport', val: transportVal, color: '#ff4757' },
    { id: 'donut-diet', val: dietVal, color: '#ff9f43' },
    { id: 'donut-energy', val: energyVal, color: '#00f59b' },
    { id: 'donut-waste', val: wasteVal, color: '#6b7280' }
  ];
  
  let accumulatedOffset = 0;
  const totalCircumference = 377; // 2 * pi * r (r=60)
  
  segments.forEach(seg => {
    const el = document.getElementById(seg.id);
    if (!el) return;
    
    if (total === 0) {
      el.style.strokeDashoffset = totalCircumference;
      return;
    }
    
    const percentage = seg.val / total;
    const strokeDash = percentage * totalCircumference;
    const strokeOffset = totalCircumference - strokeDash + accumulatedOffset;
    
    el.style.strokeDasharray = `${strokeDash} ${totalCircumference - strokeDash}`;
    el.style.strokeDashoffset = strokeOffset;
    
    accumulatedOffset -= strokeDash;
  });

  // Render Legend
  const legendList = document.getElementById('breakdown-legend-list');
  legendList.innerHTML = '';
  segments.forEach(seg => {
    const key = seg.id.replace('donut-', '');
    const meta = CATEGORY_META[key];
    const percentage = total > 0 ? Math.round((seg.val / total) * 100) : 0;
    
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.title = `What this means: ${meta.description}`;
    item.innerHTML = `
      <div class="legend-info">
        <span class="legend-color-dot" style="background:${meta.color}"></span>
        <span class="legend-label">${meta.title} (${percentage}%)</span>
      </div>
      <span class="legend-value">${seg.val.toFixed(1)} kg</span>
    `;
    legendList.appendChild(item);
  });

  // Highlight Biggest Pollution Hotspot
  const mapped = [
    { key: 'transport', val: transportVal, title: 'Transport Commute', desc: 'Your fuel burning solo car travel creates major direct greenhouse outputs. Choose metro or EV options to clear this bottleneck.' },
    { key: 'diet', val: dietVal, title: 'Dietary Footprint', desc: 'Frequent red meat consumption creates intense agricultural greenhouse impact. Swapping to chicken or lentils makes a huge drop.' },
    { key: 'energy', val: energyVal, title: 'Grid Power Usage', desc: 'Long air conditioner cycles pull heavily from thermal energy grids. Using timers and fans can cut usage.' },
    { key: 'waste', val: wasteVal, title: 'Organic Wastes', desc: 'Unsegregated kitchen waste undergoes anaerobic decay in landfills, leaking methane. Start wet waste composting.' }
  ];
  
  mapped.sort((a, b) => b.val - a.val);
  const topHotspot = mapped[0];
  const hotspotMeta = CATEGORY_META[topHotspot.key];
  const hotspotPerc = total > 0 ? Math.round((topHotspot.val / total) * 100) : 0;

  document.getElementById('hotspot-title').innerText = topHotspot.title;
  document.getElementById('hotspot-impact-perc').innerText = `${hotspotPerc}% of your emissions`;
  document.getElementById('hotspot-desc').innerText = topHotspot.desc;
  
  const iconContainer = document.getElementById('hotspot-icon-container');
  iconContainer.innerHTML = `<i data-lucide="${hotspotMeta.icon}" class="hotspot-icon"></i>`;
  iconContainer.style.background = `rgba(${hexToRgb(hotspotMeta.color)}, 0.1)`;
  iconContainer.style.borderColor = `rgba(${hexToRgb(hotspotMeta.color)}, 0.25)`;
  iconContainer.style.color = hotspotMeta.color;

  // Render Detailed Category Grid cards
  const categoryCards = document.getElementById('category-cards-container');
  categoryCards.innerHTML = '';
  
  const categoryDetails = [
    { key: 'transport', name: 'Transport', subtitle: 'Travel Telemetry', co2: transportVal, advice: 'Alternative: Metro transit saves 88% kg CO₂/km.' },
    { key: 'diet', name: 'Diet Pattern', subtitle: 'Food logistics', co2: dietVal, advice: 'Alternative: Dals & plant-based proteins cut land footprints.' },
    { key: 'energy', name: 'Grid Energy', subtitle: 'Power infrastructure', co2: energyVal, advice: 'Alternative: Solar panels eliminate peak grid loading.' },
    { key: 'waste', name: 'Waste Output', subtitle: 'Landfill leakage', co2: wasteVal, advice: 'Alternative: Composting prevents high methane release.' }
  ];

  categoryDetails.forEach(cat => {
    const meta = CATEGORY_META[cat.key];
    const card = document.createElement('div');
    card.className = 'category-detail-card';
    card.innerHTML = `
      <div class="cat-card-header">
        <span class="cat-card-title">${cat.name}</span>
        <div class="cat-card-icon" style="background:rgba(${hexToRgb(meta.color)}, 0.1); color:${meta.color}">
          <i data-lucide="${meta.icon}"></i>
        </div>
      </div>
      <span class="cat-card-value">${cat.co2.toFixed(1)} kg</span>
      <p class="cat-card-desc">${cat.advice}</p>
    `;
    categoryCards.appendChild(card);
  });
  
  lucide.createIcons();
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 245, 155';
}

// Render AI Coach personality profiles
function renderCoachScreen() {
  document.getElementById('personality-type-text').innerText = state.user.personality;
  
  const personalityIcon = document.getElementById('personality-icon');
  // Dynamic icon for coach panel
  if (state.user.score > 750) {
    personalityIcon.setAttribute('data-lucide', 'shield-check');
  } else {
    personalityIcon.setAttribute('data-lucide', 'alert-circle');
  }
  lucide.createIcons();
}

// Badge status toggler
function updateBadgesStatus() {
  const habits = state.user.habits;
  
  state.badges.forEach(b => {
    if (b.id === 'low_car') {
      b.unlocked = ['metro', 'ev', 'cycle'].includes(habits.transport);
    } else if (b.id === 'plant_based') {
      b.unlocked = ['vegetarian', 'vegan'].includes(habits.diet);
    } else if (b.id === 'energy_saver') {
      b.unlocked = ['low', 'solar'].includes(habits.energy);
    } else if (b.id === 'zero_waste') {
      b.unlocked = habits.waste === 'compost';
    }
  });
}

// Render Gamification Page components
function renderGamificationScreen() {
  // 1. Level progressions
  const userScore = state.user.score;
  document.getElementById('current-score-label').innerText = `${userScore} Score`;
  
  let minBound = 0;
  let maxBound = 1000;
  let standing = 'Eco Beginner';
  let nextStanding = 'Green Optimizer';
  
  if (userScore <= 300) {
    minBound = 0; maxBound = 300; standing = 'High Impact User'; nextStanding = 'Eco Beginner';
  } else if (userScore <= 600) {
    minBound = 301; maxBound = 600; standing = 'Eco Beginner'; nextStanding = 'Conscious User';
  } else if (userScore <= 750) {
    minBound = 601; maxBound = 750; standing = 'Conscious User'; nextStanding = 'Balanced User';
  } else if (userScore <= 900) {
    minBound = 751; maxBound = 900; standing = 'Balanced User'; nextStanding = 'Green Optimizer';
  } else {
    minBound = 901; maxBound = 1000; standing = 'Green Optimizer'; nextStanding = 'Eco Legend (Perfect)';
  }
  
  document.getElementById('user-standing-level').innerText = standing;
  document.getElementById('prev-level-bound').innerText = minBound;
  document.getElementById('next-level-bound').innerText = maxBound;
  
  const nextTargetRange = maxBound - minBound;
  const userProgress = userScore - minBound;
  const percent = Math.min(100, Math.max(0, (userProgress / nextTargetRange) * 100));
  
  document.getElementById('level-progress-fill').style.width = `${percent}%`;
  document.getElementById('points-to-next-level').innerText = `Reach ${maxBound + 1} points for ${nextStanding}`;
  document.getElementById('streak-days-span').innerText = state.user.streakDays;
  document.getElementById('streak-count-val').innerText = state.user.streakDays;

  // 2. Badges List
  const badgesContainer = document.getElementById('badges-container-list');
  badgesContainer.innerHTML = '';
  
  state.badges.forEach(badge => {
    const el = document.createElement('div');
    el.className = `badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`;
    el.innerHTML = `
      <div class="badge-icon-holder">
        <i data-lucide="${badge.icon}"></i>
      </div>
      <span class="badge-name">${badge.name}</span>
      <span class="badge-hint">${badge.hint}</span>
    `;
    badgesContainer.appendChild(el);
  });

  // 3. Leaderboard list (sort by carbon score descending)
  state.leaderboard.sort((a, b) => b.score - a.score);
  
  const rowContainer = document.getElementById('leaderboard-rows-container');
  rowContainer.innerHTML = '';
  
  state.leaderboard.forEach((user, index) => {
    const row = document.createElement('div');
    row.className = `leaderboard-user-row ${user.isSelf ? 'current-user' : ''}`;
    row.innerHTML = `
      <span class="col-rank">#${index + 1}</span>
      <div class="col-user user-identity">
        <div class="user-identity-avatar">${user.name.charAt(0)}</div>
        <span class="col-user-name">${user.name} ${user.isSelf ? '(You)' : ''}</span>
      </div>
      <span class="col-level col-level-val">${user.level}</span>
      <span class="col-streak col-streak-val"><i data-lucide="flame"></i> ${user.streak}d</span>
      <span class="col-score col-score-val">${user.score}</span>
      <span class="col-saved col-saved-val">${user.saved.toFixed(1)} kg</span>
    `;
    rowContainer.appendChild(row);
  });
  
  lucide.createIcons();
}

// -------------------------------------------------------------
// AI COACH BOT CHAT INTERFACE SIMULATION
// -------------------------------------------------------------
function initCoachListeners() {
  const form = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickBtns = document.querySelectorAll('.quick-prompt-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      
      handleUserQuery(text);
      chatInput.value = '';
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      handleUserQuery(query);
    });
  });
}

function handleUserQuery(query) {
  appendMessage(query, 'user-msg');
  
  // Show Typing indicator
  const indicator = showTypingIndicator();
  
  // Wait 1.8 seconds for simulation delay
  setTimeout(() => {
    indicator.remove();
    processAIResponse(query);
  }, 1600);
}

function appendMessage(text, className) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = `message ${className}`;
  
  msg.innerHTML = `
    <div class="msg-content">
      <p>${text}</p>
    </div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const indicator = document.createElement('div');
  indicator.className = 'message system-msg';
  indicator.innerHTML = `
    <div class="msg-content typing-indicator">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  return indicator;
}

function processAIResponse(query) {
  const normalized = query.toLowerCase();
  let data = null;
  
  // Heuristic matching of questions to specific detailed responses
  if (normalized.includes('ac') || normalized.includes('electricity') || normalized.includes('bangalore')) {
    data = SIMULATED_COACH_RESPONSES.ac_bangalore;
  } else if (normalized.includes('diet') || normalized.includes('vegetarian') || normalized.includes('food')) {
    data = SIMULATED_COACH_RESPONSES.indian_diet;
  } else if (normalized.includes('uber') || normalized.includes('car') || normalized.includes('commute')) {
    data = SIMULATED_COACH_RESPONSES.uber_share;
  } else if (normalized.includes('waste') || normalized.includes('segregate') || normalized.includes('compost')) {
    data = SIMULATED_COACH_RESPONSES.waste_segregation;
  } else {
    // Generate a fallback response in the requested Master Prompt JSON layout dynamically
    data = {
      "carbon_personality_type": state.user.personality,
      "total_footprint_estimate": `${state.user.dailyFootprint.toFixed(1)} kg CO₂/day overall footprint`,
      "impact_hotspots": ["General urban carbon emissions"],
      "top_3_actions": [
        {
          "action": "Divert travel to walking or cycling for distances under 2 km",
          "why_it_matters": "Short drives burn rich starting mixtures, creating excessive fuel waste per km compared to cruising speeds.",
          "co2_saving_estimate": "1.2 kg CO₂ saved per trip",
          "effort_level": "low"
        },
        {
          "action": "Set refrigerator cooling targets to 4°C and freezer to -18°C",
          "why_it_matters": "Over-cooling appliances draws heavy passive loads from national coal power grids 24/7.",
          "co2_saving_estimate": "0.8 kg CO₂ saved daily",
          "effort_level": "low"
        },
        {
          "action": "Switch utility contracts to solar or purchase clean offsets",
          "why_it_matters": "Directly drives local power grids to source electricity from renewable farms rather than standard heavy coal.",
          "co2_saving_estimate": "5.4 kg CO₂ saved daily",
          "effort_level": "high"
        }
      ],
      "micro_actions": [
        "Unplug desktop chargers and stand-by TVs during nights",
        "Refuse single-use shopping packaging bags"
      ],
      "future_projection_30_days": "Implementing these general habits prevents 180 kg CO₂ from entering the atmosphere in 30 days.",
      "motivational_insight": "Carbon intelligence is not about sacrifice. It is about understanding resource paths to make conscious adjustments."
    };
  }

  // Parse and render the structured JSON data as standard clean HTML blocks in the Chat UI
  renderStructuredCoachMsg(data);
}

function renderStructuredCoachMsg(data) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'message system-msg';
  
  // Format actions list HTML
  let actionsHTML = '';
  data.top_3_actions.forEach(act => {
    actionsHTML += `
      <div class="action-item-card">
        <div class="action-item-header">
          <span class="action-item-title">${act.action}</span>
          <span class="effort-badge effort-${act.effort_level}">${act.effort_level}</span>
        </div>
        <p class="action-item-why">${act.why_it_matters}</p>
        <span class="action-item-saving">Estimated: ${act.co2_saving_estimate}</span>
      </div>
    `;
  });

  // Format micro-actions list HTML
  let microHTML = '';
  data.micro_actions.forEach(micro => {
    microHTML += `<li>${micro}</li>`;
  });

  msg.innerHTML = `
    <div class="msg-content">
      <div class="ai-reasoning-response">
        <div class="badge-tag">AI ANALYSIS REPORT</div>
        <p>I have processed your query based on current urban metrics. Here is your tailored carbon intelligence action plan:</p>
        
        <div class="ai-card-section">
          <h5><i data-lucide="award"></i> Profile Standing</h5>
          <p><strong>Classification:</strong> ${data.carbon_personality_type}</p>
          <p><strong>Footprint Impact:</strong> ${data.total_footprint_estimate}</p>
          <div class="hotspot-chip-list">
            ${data.impact_hotspots.map(h => `<span class="hotspot-chip">${h}</span>`).join('')}
          </div>
        </div>

        <div class="ai-card-section">
          <h5><i data-lucide="zap"></i> Top 3 Impact Actions</h5>
          <div class="actions-list">
            ${actionsHTML}
          </div>
        </div>

        <div class="ai-card-section">
          <h5><i data-lucide="check-square"></i> Micro Actions</h5>
          <ul style="padding-left: 18px; font-size:12.5px; line-height: 1.5; color:var(--text-muted);">
            ${microHTML}
          </ul>
        </div>

        <div class="ai-card-section" style="border-left: 3px solid var(--accent-neon); background: rgba(0,245,155,0.02);">
          <h5><i data-lucide="trending-up"></i> 30-Day Projections</h5>
          <p style="font-size:13px;">${data.future_projection_30_days}</p>
        </div>

        <p style="font-style: italic; font-size: 12.5px; color: var(--text-muted); margin-top: 8px;">
          "${data.motivational_insight}"
        </p>
      </div>
    </div>
  `;

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

// -------------------------------------------------------------
// SAVINGS TREND CHART RENDERERS (SVG BASE)
// -------------------------------------------------------------
function initTrendCharts() {
  const tabs = document.querySelectorAll('.trend-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.trendPeriod = e.target.getAttribute('data-period');
      renderTrendChart();
    });
  });
}

function renderTrendChart() {
  const svg = document.getElementById('trend-svg');
  if (!svg) return;
  
  svg.innerHTML = '';
  
  // Data sets (Carbon savings in kg CO2)
  const dataWeekly = [
    { label: 'Wk 1', val: 25 },
    { label: 'Wk 2', val: 32 },
    { label: 'Wk 3', val: 28 },
    { label: 'Wk 4', val: 38 },
    { label: 'Wk 5', val: 42 },
    { label: 'Wk 6', val: state.user.weeklySaved } // Dynamic current savings
  ];

  const dataMonthly = [
    { label: 'Jan', val: 95 },
    { label: 'Feb', val: 120 },
    { label: 'Mar', val: 110 },
    { label: 'Apr', val: 145 },
    { label: 'May', val: 170 },
    { label: 'Jun', val: Math.round(state.user.weeklySaved * 4.2) } // Projected dynamic month
  ];

  const data = state.trendPeriod === 'weekly' ? dataWeekly : dataMonthly;
  const maxVal = Math.max(...data.map(d => d.val), 50); // upper limit buffer
  
  const width = 600;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  
  // Generate grid guide lines
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const yVal = paddingTop + (graphHeight / gridCount) * i;
    const valueLabel = Math.round(maxVal - (maxVal / gridCount) * i);
    
    // Grid line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', yVal);
    line.setAttribute('x2', width - paddingRight);
    line.setAttribute('y2', yVal);
    line.className.baseVal = 'chart-grid-line';
    svg.appendChild(line);
    
    // Label text
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', paddingLeft - 10);
    label.setAttribute('y', yVal + 4);
    label.setAttribute('text-anchor', 'end');
    label.className.baseVal = 'chart-label';
    label.textContent = valueLabel;
    svg.appendChild(label);
  }

  // Draw Bars & Line points
  const points = [];
  const barSpacing = graphWidth / data.length;
  
  data.forEach((d, idx) => {
    const x = paddingLeft + barSpacing * idx + barSpacing / 2;
    const y = paddingTop + graphHeight - (d.val / maxVal) * graphHeight;
    points.push({ x, y });

    // Draw Column Bar backplate
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - 16);
    rect.setAttribute('y', y);
    rect.setAttribute('width', 32);
    rect.setAttribute('height', paddingTop + graphHeight - y);
    rect.setAttribute('rx', 4);
    rect.className.baseVal = `chart-bar ${idx === data.length - 1 ? 'current' : ''}`;
    
    // Highlight tooltip title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Savings: ${d.val} kg CO₂`;
    rect.appendChild(title);
    
    svg.appendChild(rect);

    // Label on bottom axis
    const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    axisLabel.setAttribute('x', x);
    axisLabel.setAttribute('y', height - 10);
    axisLabel.setAttribute('text-anchor', 'middle');
    axisLabel.className.baseVal = 'chart-label';
    axisLabel.textContent = d.label;
    svg.appendChild(axisLabel);
  });

  // Draw smooth linking line
  let pathD = '';
  points.forEach((p, idx) => {
    if (idx === 0) {
      pathD += `M ${p.x} ${p.y}`;
    } else {
      pathD += ` L ${p.x} ${p.y}`;
    }
  });

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.className.baseVal = 'chart-line';
  svg.appendChild(path);

  // Draw Dots on line
  points.forEach((p, idx) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', 5);
    circle.className.baseVal = 'chart-dot';
    
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${data[idx].val} kg Saved`;
    circle.appendChild(title);
    
    svg.appendChild(circle);
  });
}

// -------------------------------------------------------------
// HELP TOOLTIP HANDLERS
// -------------------------------------------------------------
function initTooltips() {
  // Tooltips are handled natively via title tag attributes on elements containing "info-icon" chips.
  // Add CSS hover pointer behavior to make them visible.
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS SYSTEM
// -------------------------------------------------------------
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'check-circle';
  if (type === 'warning') {
    icon = 'alert-triangle';
    toast.style.borderColor = 'var(--accent-warn)';
  } else if (type === 'info') {
    icon = 'info';
    toast.style.borderColor = 'var(--text-muted)';
  }
  
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Auto remove toast from DOM after animations finish (5 seconds)
  setTimeout(() => {
    toast.remove();
  }, 4800);
}

// -------------------------------------------------------------
// CANVAS CONFETTI PARTICLE EMITTER (STANDALONE)
// -------------------------------------------------------------
let confettiActive = false;
let confettiParticles = [];
const confettiColors = ['#00f59b', '#10b981', '#ff9f43', '#ffffff', '#a7f3d0'];

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Resize canvas to cover window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  confettiParticles = [];
  
  // Spawn 120 particles
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 50,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 15 - 10,
      size: Math.random() * 8 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.35,
      drag: 0.98
    });
  }
  
  if (!confettiActive) {
    confettiActive = true;
    requestAnimationFrame(updateConfetti);
  }
}

function updateConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let elementsActive = false;
  
  confettiParticles.forEach(p => {
    p.vy += p.gravity;
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    
    // Fade out as it descends below screen
    if (p.vy > 0) {
      p.opacity -= 0.015;
    }
    
    if (p.opacity > 0 && p.y < canvas.height + 40) {
      elementsActive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      
      // Draw rectangular confetti piece
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.5);
      ctx.restore();
    }
  });
  
  if (elementsActive) {
    requestAnimationFrame(updateConfetti);
  } else {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Adjust canvas resolution on resize
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && confettiActive) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
