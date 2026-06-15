import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send, Bot, MessageSquare, ShieldCheck, AlertCircle, Award, Zap, CheckSquare, TrendingUp } from 'lucide-react';

const STATIC_RESPONSES = {
  ac_bangalore: {
    carbon_personality_type: "High Impact Consumer",
    total_footprint_estimate: "9.0 kg CO₂/day from AC operations",
    impact_hotspots: ["AC runtimes exceeding 8 hours/day", "Coal-heavy grid energy in Karnataka"],
    top_3_actions: [
      {
        action: "Increase AC Setpoint to 24°C & engage Ceiling Fan",
        why_it_matters: "Every 1°C increase saves 6% electricity. Combining with a fan matches the cooling feel of 21°C at a fraction of the power.",
        co2_saving_estimate: "2.2 kg CO₂ saved daily",
        effort_level: "low"
      },
      {
        action: "Use AC Timer and auto-shutoff at 4:00 AM",
        why_it_matters: "Bangalore nights drop to comfortable temperatures. Running AC until dawn wastes energy during sleep when ambient air is cool.",
        co2_saving_estimate: "3.5 kg CO₂ saved daily",
        effort_level: "low"
      },
      {
        action: "Install thermal curtains on West-facing windows",
        why_it_matters: "Reduces solar heat gain, preventing the AC compressor from running at peak load during afternoon heat spikes.",
        co2_saving_estimate: "1.8 kg CO₂ saved daily",
        effort_level: "medium"
      }
    ],
    micro_actions: [
      "Clean AC filters bi-weekly to improve efficiency by 15%",
      "Seal door/window gaps using rubber strips to prevent cold air leaks"
    ],
    future_projection_30_days: "Transitioning to 24°C + timer saves 171 kg CO₂ over 30 days (equivalent to planting 8 trees).",
    motivational_insight: "In Bangalore's moderate climate, smart ventilation and fan usage can cut cooling carbon footprint by up to 50% without compromising comfort."
  },
  indian_diet: {
    carbon_personality_type: "Conscious Commuter",
    total_footprint_estimate: "8.0 kg CO₂/day from heavy meat dietary habits",
    impact_hotspots: ["Frequent mutton and beef intake", "High dairy consumption (paneer/ghee imports)"],
    top_3_actions: [
      {
        action: "Switch from Red Meat to Poultry or Fish",
        why_it_matters: "Mutton/beef production has a carbon footprint 5x higher than poultry, demanding intensive land and feed resources.",
        co2_saving_estimate: "4.2 kg CO₂ saved per meal replaced",
        effort_level: "medium"
      },
      {
        action: "Integrate local Indian Millets (Ragi/Jowar) as carb base",
        why_it_matters: "Millets require 10x less water than rice and are resilient crops, offering high nutrition with minimal ecological strain.",
        co2_saving_estimate: "1.1 kg CO₂ saved daily",
        effort_level: "low"
      },
      {
        action: "Establish 3 Plant-based days weekly",
        why_it_matters: "Swapping dairy/meat for dals and local vegetables significantly reduces agricultural greenhouse emissions.",
        co2_saving_estimate: "3.5 kg CO₂ saved weekly",
        effort_level: "low"
      }
    ],
    micro_actions: [
      "Purchase seasonal, locally-grown vegetables to bypass long-distance transport emissions",
      "Avoid food waste; organic kitchen waste decomposing in garbage piles releases methane"
    ],
    future_projection_30_days: "Replacing mutton with lentils/chicken 4 times a week cuts 96 kg CO₂ in a month.",
    motivational_insight: "Traditional Indian vegetarian diets are structurally among the lowest carbon profiles globally. Reclaiming local pulses and millets is the perfect eco-action."
  }
};

export default function AICoach({ habits, personality, dailyFootprint }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome! I am CarbonMind AI, your personal carbon strategist. I analyze your lifestyle parameters and design tailored mitigation plans for urban Indian contexts.',
      isWelcoming: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: textToSend }]);
    setIsTyping(true);

    // Clear input
    setInputText('');

    // Simulate delay
    setTimeout(() => {
      setIsTyping(false);
      
      const query = textToSend.toLowerCase();
      let reportData = null;

      if (query.includes('ac') || query.includes('bangalore') || query.includes('electricity')) {
        reportData = STATIC_RESPONSES.ac_bangalore;
      } else if (query.includes('diet') || query.includes('food') || query.includes('vegetarian')) {
        reportData = STATIC_RESPONSES.indian_diet;
      } else {
        // Dynamic Fallback response matching structure
        reportData = {
          carbon_personality_type: personality,
          total_footprint_estimate: `${dailyFootprint.toFixed(1)} kg CO₂/day overall footprint`,
          impact_hotspots: ["General urban utility consumption"],
          top_3_actions: [
            {
              action: "Divert travel to walking or cycling for distances under 2 km",
              why_it_matters: "Short drives burn rich starting mixtures, creating excessive fuel waste per km compared to cruising speeds.",
              co2_saving_estimate: "1.2 kg CO₂ saved per trip",
              effort_level: "low"
            },
            {
              action: "Clean passive refrigerator coils and space behind appliance",
              why_it_matters: "Dust build-up increases cooling power demands from municipal coal grids by 10-15%.",
              co2_saving_estimate: "0.8 kg CO₂ saved daily",
              effort_level: "low"
            },
            {
              action: "Opt-in to utility solar green tariffs if available",
              why_it_matters: "Promotes local renewable energy investments on regional power transmission networks.",
              co2_saving_estimate: "5.4 kg CO₂ saved daily",
              effort_level: "high"
            }
          ],
          micro_actions: [
            "Turn off idle electrical adaptors and TV screens at the wall socket",
            "Carry a cotton bag to local shops to avoid packaging single-use waste"
          ],
          future_projection_30_days: "Implementing these routines will cut ~42 kg CO₂ next month.",
          motivational_insight: "Carbon intelligence is not about sacrifice. It is about understanding resource paths to make conscious adjustments."
        };
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        report: reportData 
      }]);
    }, 1500);
  };

  return (
    <div className="coach-grid">
      
      {/* Left panel prompt guides */}
      <div className="glass-card prompt-guide-panel">
        <h3>Carbon Reasoning Coach</h3>
        <p className="panel-subtitle">CarbonMind AI uses a sustainability intelligence framework to guide your transition.</p>

        <div className="coach-prompt-info">
          <p className="info-text" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Select one of our carbon strategy pathways or ask a custom question below:
          </p>
          <div className="quick-prompts-list">
            <button 
              className="quick-prompt-btn"
              onClick={() => handleSend('How can I optimize my AC electricity footprint in Bangalore?')}
            >
              <MessageSquare size={14} style={{ color: 'var(--accent-neon)' }} />
              <span>Optimize AC footprint in Bangalore</span>
            </button>
            <button 
              className="quick-prompt-btn"
              onClick={() => handleSend('What is the realistic Indian dietary alternative to reduce carbon?')}
            >
              <MessageSquare size={14} style={{ color: 'var(--accent-neon)' }} />
              <span>Indian diet alternative analysis</span>
            </button>
          </div>
        </div>

        {/* Personality Box */}
        <div className="glass-card inner-card personality-card" style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.01)' }}>
          <div className="card-header">
            <h4>Carbon Personality Type</h4>
          </div>
          <div className="personality-content">
            <div className="personality-avatar">
              {scoreIconSelector(personality)}
            </div>
            <div className="personality-details">
              <h5>{personality}</h5>
              <p>Your emissions indicate clear opportunities for low-effort, high-impact improvements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel chat */}
      <div className="glass-card chat-panel">
        <div className="chat-header">
          <div className="coach-avatar">
            <Bot size={20} />
          </div>
          <div className="coach-status">
            <h4>CarbonMind AI Coach</h4>
            <span className="status-indicator online">Reasoning Engine Active</span>
          </div>
        </div>

        <div className="chat-messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender === 'ai' ? 'system-msg' : 'user-msg'}`}
            >
              <div className="msg-content">
                {msg.text && <p>{msg.text}</p>}
                {msg.isWelcoming && (
                  <p style={{ marginTop: 8 }}>
                    Ask me how to reduce your travel footprint, optimize your home energy, or suggest dietary changes.
                  </p>
                )}
                {msg.report && renderAIReportCard(msg.report)}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message system-msg">
              <div className="msg-content typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }} 
            className="chat-form"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a sustainability question..." 
              className="chat-input-field"
            />
            <button type="submit" className="btn btn-primary chat-send-btn" aria-label="Send query">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

function scoreIconSelector(personality) {
  if (['Balanced User', 'Green Optimizer'].includes(personality)) {
    return <ShieldCheck size={20} />;
  }
  return <AlertCircle size={20} />;
}

function renderAIReportCard(report) {
  return (
    <div className="ai-reasoning-response">
      <div className="badge-tag">AI ANALYSIS REPORT</div>
      <p>I have processed your query based on current urban metrics. Here is your tailored carbon intelligence action plan:</p>

      <div className="ai-card-section">
        <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={14} /> Profile Standing
        </h5>
        <p><strong>Classification:</strong> {report.carbon_personality_type}</p>
        <p><strong>Footprint Impact:</strong> {report.total_footprint_estimate}</p>
        <div className="hotspot-chip-list">
          {report.impact_hotspots.map((h, idx) => (
            <span key={idx} className="hotspot-chip">{h}</span>
          ))}
        </div>
      </div>

      <div className="ai-card-section">
        <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} /> Top 3 Impact Actions
        </h5>
        <div className="actions-list">
          {report.top_3_actions.map((act, idx) => (
            <div key={idx} className="action-item-card">
              <div className="action-item-header">
                <span className="action-item-title">{act.action}</span>
                <span className={`effort-badge effort-${act.effort_level}`}>
                  {act.effort_level}
                </span>
              </div>
              <p className="action-item-why">{act.why_it_matters}</p>
              <span className="action-item-saving">Estimated: {act.co2_saving_estimate}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-card-section">
        <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckSquare size={14} /> Micro Actions
        </h5>
        <ul style={{ paddingLeft: 18, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
          {report.micro_actions.map((micro, idx) => (
            <li key={idx}>{micro}</li>
          ))}
        </ul>
      </div>

      <div className="ai-card-section" style={{ borderLeft: '3px solid var(--accent-neon)', background: 'rgba(0,245,155,0.02)' }}>
        <h5 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={14} /> 30-Day Projections
        </h5>
        <p style={{ fontSize: 13 }}>{report.future_projection_30_days}</p>
      </div>

      <p style={{ fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-muted)', marginTop: 8 }}>
        "{report.motivational_insight}"
      </p>
    </div>
  );
}
