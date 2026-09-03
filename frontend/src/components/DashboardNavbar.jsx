import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Globe, Info, Sparkles, CreditCard, LogOut,
  Layers, ShieldCheck, Check
} from 'lucide-react';
import logoImg from '../assets/Logo.png';

export default function DashboardNavbar({
  activeTab,
  onTabChange,
  user,
  profile,
  onOpenPricing,
  onLogout
}) {
  const userTier = profile?.plan_tier || 'free';

  const getTierDisplay = () => {
    if (userTier === 'pro') {
      return (
        <span className="dash-plan-pill pro">
          <Sparkles size={13} /> Plan (Pro Visionary)
        </span>
      );
    }
    if (userTier === 'lite') {
      return (
        <span className="dash-plan-pill lite">
          <ShieldCheck size={13} /> Plan (Lite Creator)
        </span>
      );
    }
    return (
      <span className="dash-plan-pill free">
        <ShieldCheck size={13} /> Plan (Free)
      </span>
    );
  };

  const navItems = [
    { id: 'upload', label: 'Generator', icon: Layers, isAction: false },
    { id: 'personal-info', label: 'Personal Info', icon: User, isAction: false },
    { id: 'active-links', label: 'Active links', icon: Globe, isAction: false },
    { id: 'about-us', label: 'About Us', icon: Info, isAction: false },
    { id: 'features', label: 'Features', icon: Sparkles, isAction: false },
    { id: 'pricing', label: 'Pricing', icon: CreditCard, isAction: true, onClick: onOpenPricing },
    { id: 'signout', label: 'Sign Out', icon: LogOut, isAction: true, onClick: onLogout },
  ];

  return (
    <header className="dash-header-sketch">
      <div className="dash-header-container">
        
        {/* Top Row: Brand & User Controls */}
        <div className="dash-header-top-row">
          {/* Brand Logo & Name */}
          <div
            className="sketch-nav-brand"
            onClick={() => onTabChange('upload')}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoImg} alt="auoraa Logo" className="sketch-brand-logo" />
            <span className="sketch-brand-text">auoraa</span>
          </div>

          {/* User Info & Plan(Existing) Badge & Sign Out */}
          <div className="sketch-header-right">
            {/* Existing Plan Tag */}
            <div
              className="sketch-plan-badge-wrapper"
              onClick={onOpenPricing}
              title="Click to view plans & upgrades"
            >
              {getTierDisplay()}
            </div>

            {/* User Profile Pill */}
            <div
              className="sketch-user-pill"
              onClick={() => onTabChange('personal-info')}
              title="View Personal Info"
            >
              <div className="sketch-user-avatar">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="sketch-username">{user?.username || 'User'}</span>
            </div>

            {/* Direct Sign Out Button */}
            <button
              type="button"
              id="header-signout-btn"
              onClick={onLogout}
              className="sketch-signout-btn"
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Bottom Row / Navigation Bar matching handwritten sketch */}
        <nav className="sketch-nav-bar" aria-label="Dashboard Navigation">
          <div className="sketch-nav-items">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={`sketch-nav-btn ${item.id === 'pricing' ? 'pricing-highlight' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`sketch-nav-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

      </div>
    </header>
  );
}
