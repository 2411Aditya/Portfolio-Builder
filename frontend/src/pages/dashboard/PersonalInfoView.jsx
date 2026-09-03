import React from 'react';
import { User, Mail, ShieldCheck, Sparkles, Calendar, Layers, Globe, ArrowRight, ExternalLink, Zap } from 'lucide-react';

export default function PersonalInfoView({ user, profile, portfoliosCount, onOpenPricing, onNavigateHome }) {
  const userTier = profile?.plan_tier || 'free';
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Active Member';

  const getTierBadge = () => {
    if (userTier === 'pro') {
      return (
        <span style={{ padding: '6px 14px', borderRadius: 9999, background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={15} /> Pro Visionary Plan
        </span>
      );
    }
    if (userTier === 'lite') {
      return (
        <span style={{ padding: '6px 14px', borderRadius: 9999, background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(2, 132, 199, 0.3)' }}>
          <ShieldCheck size={15} /> Lite Creator Plan
        </span>
      );
    }
    return (
      <span className="badge-green-soft" style={{ padding: '6px 14px', fontSize: 13 }}>
        <ShieldCheck size={15} /> Free Starter Plan
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)', marginBottom: 6 }}>ACCOUNT PROFILE</div>
        <h1 className="display-sm" style={{ fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
          Personal Information
        </h1>
        <p className="body-sm" style={{ marginTop: 4, color: 'var(--color-mute)' }}>
          Manage your account credentials, current subscription tier, and workspace limits.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {/* User Card */}
        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #080808, #374151)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
                {user?.username || 'Auoraa Creator'}
              </h2>
              <div style={{ marginTop: 4 }}>{getTierBadge()}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid var(--color-hairline)', paddingTop: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-mute)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={13} /> Username
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>
                {user?.username || '—'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-mute)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={13} /> Email Address
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>
                {user?.email || `${user?.username || 'user'}@auoraa.app`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-mute)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} /> Member Since
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>
                {joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Limits Card */}
        <div className="dash-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>PLAN DETAILS & LIMITS</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-ink)' }}>
              Current Tier: <span style={{ textTransform: 'capitalize' }}>{userTier}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, color: 'var(--color-body)' }}>Active Portfolios</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{portfoliosCount} Live</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, color: 'var(--color-body)' }}>Available Templates</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                  {userTier === 'pro' ? '10/10 (All Unlocked)' : userTier === 'lite' ? '6/10 (Lite)' : '2/10 (Free)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, color: 'var(--color-body)' }}>AI Customizer Access</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: userTier === 'pro' ? '#a855f7' : 'var(--color-mute)' }}>
                  {userTier === 'pro' ? 'Enabled' : 'Requires Pro'}
                </span>
              </div>
            </div>
          </div>

          <div>
            {userTier !== 'pro' ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="button-primary"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  border: 'none',
                  padding: '12px 18px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.25)',
                }}
              >
                <Sparkles size={16} /> Upgrade Plan for More Features
              </button>
            ) : (
              <div style={{ padding: '12px 16px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, color: '#6b21a8', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                ✨ You have unlocked all Pro features and all 10 templates!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div style={{ marginTop: 24, padding: '20px 24px', background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>Ready to generate another portfolio?</h4>
          <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--color-mute)' }}>Upload a new resume to test another of our 10 modular designs.</p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="button-primary"
          style={{ fontSize: 13, padding: '8px 18px' }}
        >
          <Zap size={14} /> Go to Generator
        </button>
      </div>
    </div>
  );
}
