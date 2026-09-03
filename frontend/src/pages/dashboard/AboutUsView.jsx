import React from 'react';
import { Sparkles, Zap, ShieldCheck, Heart, Award, ArrowRight, Code, Users } from 'lucide-react';

export default function AboutUsView({ onNavigateHome, onOpenPricing }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)', marginBottom: 6 }}>OUR STORY & MISSION</div>
        <h1 className="display-sm" style={{ fontWeight: 800, margin: '0 0 10px 0', color: 'var(--color-ink)' }}>
          About auoraa
        </h1>
        <p className="body-sm" style={{ maxWidth: 600, margin: '0 auto', color: 'var(--color-body)', fontSize: 15, lineHeight: 1.6 }}>
          We believe building a world-class, high-converting portfolio website should take <strong>10 seconds</strong>, not weeks of tedious coding.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Zap size={22} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }}>
            Instant AI Transformation
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
            Upload any resume in PDF, DOCX, TXT, or Image format. Our neural parser extracts your experience, achievements, tech stack, and personal story into structured, beautiful interactive cards.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }}>
            10 Modular Design Systems
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
            From clean Minimal Classic and Hacker Developer Terminal to Bento Grids, Glassmorphism, and Notion-style workspaces, every design is responsive, accessible, and fast.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-ink)' }}>
            Privacy & Performance First
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
            Your career data belongs to you. Every generated site is hosted on ultra-fast edge infrastructure with automatic SSL, zero tracker bloat, and instant permalinks.
          </p>
        </div>
      </div>

      {/* Creator / Vision Statement */}
      <div className="dash-card" style={{ padding: 32, background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#ffffff', borderRadius: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          <Award size={16} /> The auoraa Vision
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px 0', color: '#ffffff' }}>
          Crafted for ambitious developers, designers & creators worldwide.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#cbd5e1', margin: '0 0 20px 0' }}>
          Traditional portfolio websites require hours of CSS styling, hosting setups, responsive testing, and constant updates. Auoraa solves this forever: drop your resume, choose your visual style, and share a verified portfolio link with recruiters and clients in seconds.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            Create Your Portfolio Now <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={onOpenPricing}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 13,
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={14} /> View Upgrades
          </button>
        </div>
      </div>
    </div>
  );
}
