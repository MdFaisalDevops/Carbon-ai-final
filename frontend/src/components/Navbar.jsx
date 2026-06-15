import React from 'react';
import { Leaf, LayoutDashboard, BarChart3, Bot, Trophy } from 'lucide-react';

export default function Navbar({ activeScreen, setActiveScreen, userLevel }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'breakdown', name: 'Breakdown', icon: BarChart3 },
    { id: 'coach', name: 'AI Coach', icon: Bot },
    { id: 'gamification', name: 'Eco Level', icon: Trophy }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Leaf size={18} />
        </div>
        <span class="brand-name">CarbonMind <span className="accent-text">AI</span></span>
      </div>

      <nav className="nav-menu">
        {navItems.map(item => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`nav-item ${activeScreen === item.id ? 'active' : ''}`}
            >
              <IconComponent size={20} />
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">U</div>
          <div className="user-info">
            <span className="user-name">Arjun Mehta</span>
            <span className="user-level">{userLevel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
