import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Upload, Palette, Globe, Shield, Link2, ArrowRight, Star, ChevronDown } from 'lucide-react';

const features = [
  { icon: <Upload size={22} />, title: 'Smart Resume Parsing', desc: 'Upload PDF, DOCX, TXT or images. Our AI extracts every detail with precision.', color: 'linear-gradient(135deg,#6366f1,#3b82f6)' },
  { icon: <Zap size={22} />, title: 'Instant Generation', desc: 'Portfolio generated in seconds with a live shareable link — no manual editing needed.', color: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { icon: <Palette size={22} />, title: 'Beautiful Themes', desc: 'Choose between sleek Dark and clean Light themes. Both look stunning on any device.', color: 'linear-gradient(135deg,#06b6d4,#8b5cf6)' },
  { icon: <Shield size={22} />, title: 'Secure & Private', desc: 'JWT authentication keeps your data safe. Delete any portfolio instantly.', color: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
  { icon: <Globe size={22} />, title: 'Public Portfolio Links', desc: 'Share a clean URL like /p/yourname/id — accessible by anyone, anytime.', color: 'linear-gradient(135deg,#6366f1,#06b6d4)' },
  { icon: <Link2 size={22} />, title: 'Portfolio History', desc: 'Manage all your portfolios from one dashboard. Preview, copy, or delete.', color: 'linear-gradient(135deg,#3b82f6,#ec4899)' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up in seconds with email and a username.' },
  { num: '02', title: 'Upload Resume', desc: 'Drag-and-drop your resume in any format.' },
  { num: '03', title: 'AI Parses It', desc: 'Gemini AI extracts all your info into a clean structure.' },
  { num: '04', title: 'Get Your Link', desc: 'Copy your portfolio URL and share with the world.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-icon"><Zap size={18} color="#fff" /></div>
          <span className="grad">PortfolioAI</span>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="navbar-link">Sign In</Link>
          <Link to="/register" id="nav-get-started-btn" className="navbar-cta">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="orb float"  style={{ top: '15%', left: '12%', width: 450, height: 450, background: 'rgba(99,102,241,0.09)' }} />
        <div className="orb float-2" style={{ bottom: '15%', right: '12%', width: 380, height: 380, background: 'rgba(59,130,246,0.08)' }} />
        <div className="orb float-3" style={{ top: '55%', left: '50%', width: 280, height: 280, background: 'rgba(6,182,212,0.06)' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 860, margin: '0 auto', zIndex: 1 }}>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 40, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: 26, fontSize: 13, fontWeight: 600, color: '#334155' }}>
            <Star size={14} style={{ color: '#eab308', fill: '#eab308' }} />
            AI-Powered Portfolio Builder
          </div>

          <h1 className="fade-up-1" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, lineHeight: 1.12, marginBottom: 22, color: '#0f172a' }}>
            Turn Your Resume Into a{' '}
            <span className="grad">Stunning Portfolio</span>
            {' '}in Seconds
          </h1>

          <p className="fade-up-2" style={{ fontSize: 18, color: '#475569', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Upload your resume, let AI extract everything, pick a theme — and get a shareable portfolio URL instantly.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/register" id="hero-cta-primary" className="btn-grad">
              Build My Portfolio <ArrowRight size={18} />
            </Link>
            <Link to="/login" id="hero-cta-secondary" className="btn-ghost">
              Sign In
            </Link>
          </div>
        </div>

        <div className="anim-bounce" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 10, letterSpacing: 3 }}>
          <span>SCROLL</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Everything You Need to <span className="grad">Stand Out</span></h2>
          <p className="section-sub">From AI parsing to beautiful themes — PortfolioAI handles it all.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.color, boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}>
                  {React.cloneElement(f.icon, { color: '#fff' })}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: '#f1f5f9' }}>
        <div className="section-inner">
          <h2 className="section-title">How It <span className="grad">Works</span></h2>
          <p className="section-sub">Four simple steps to your dream portfolio.</p>
          <div className="timeline">
            <div className="timeline-line" />
            {steps.map((s, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-num grad">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <div className="timeline-spacer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="cta-box">
            <h2>Ready to <span className="grad">Impress</span> Recruiters?</h2>
            <p>Join and create your AI-powered portfolio in under 2 minutes.</p>
            <Link to="/register" id="cta-bottom-register" className="btn-grad" style={{ display: 'inline-flex' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        © 2026 PortfolioAI — Built with AI ❤️
      </footer>
    </div>
  );
}
