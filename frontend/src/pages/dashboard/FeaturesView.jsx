import React from 'react';
import {
  Sparkles, Zap, ShieldCheck, Palette, FileText, CheckCircle2,
  Lock, Globe, Sliders, ArrowRight, Code2, Layers, Cpu, Compass
} from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../../templates';

export default function FeaturesView({ userTier, onSelectTemplate, onOpenPricing, onNavigateHome }) {
  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)', marginBottom: 6 }}>PRODUCT CAPABILITIES</div>
        <h1 className="display-sm" style={{ fontWeight: 800, margin: '0 0 10px 0', color: 'var(--color-ink)' }}>
          auoraa Features & Ecosystem
        </h1>
        <p className="body-sm" style={{ maxWidth: 640, margin: '0 auto', color: 'var(--color-body)', fontSize: 15, lineHeight: 1.6 }}>
          Discover the complete suite of modular templates, AI-driven extraction tools, dynamic themes, and edge publishing capabilities.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <FileText size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>Multi-Format Resume Parser</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Supports PDF, DOCX, TXT, and scanned image formats. Automatically categorizes experience, skills, metrics, education, and links.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Palette size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>Dual Theming Engine</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Switch between sleek Dark Cybernetic mode and clean Minimalist Light canvas for any generated portfolio with zero CSS bugs.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Globe size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>Instant Edge Hosting</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Every portfolio receives a unique, public shareable permalink (e.g. <code>/p/username/id</code>) optimized for SEO and lightning-fast load times.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Sliders size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>Pro AI Customizer Drawer</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Pro members can tweak accent colors, inject custom bio details, rearrange sections, and customize typography on the fly.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Layers size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>10 Modular Architectural Styles</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Carefully curated layouts tailored for software engineers, product managers, designers, writers, and executives.
          </p>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>Secure Razorpay Integration</h3>
          <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, margin: 0 }}>
            Instant plan tier upgrades with end-to-end encrypted transactions via UPI, Credit/Debit Cards, Net Banking, and Wallets.
          </p>
        </div>
      </div>

      {/* 10-Template Directory Showcase */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)' }}>CATALOG</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
              10 Modular Template Showcase
            </h2>
          </div>
          {userTier !== 'pro' && (
            <button
              type="button"
              onClick={onOpenPricing}
              className="button-primary"
              style={{
                fontSize: 12,
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                border: 'none',
              }}
            >
              <Sparkles size={13} /> Unlock All Templates
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {Object.entries(TEMPLATE_REGISTRY).map(([tKey, tMeta], idx) => {
            const isUnlocked = userTier === 'pro' || (userTier === 'lite' && tMeta.tier !== 'pro') || tMeta.tier === 'free';
            return (
              <div
                key={tKey}
                className="dash-card"
                style={{
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${tMeta.thumbnailColor}`,
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-mute)' }}>
                      #{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: tMeta.tier === 'pro' ? '#a855f7' : tMeta.tier === 'lite' ? '#0284c7' : '#10b981',
                        color: '#ffffff',
                      }}
                    >
                      {tMeta.tier}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-ink)' }}>
                    {tMeta.name}
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--color-body)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                    {tMeta.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-hairline)' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {tMeta.tags?.slice(0, 2).map((tg, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 5px', borderRadius: 3, background: '#f1f5f9', color: '#475569' }}>
                        {tg}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectTemplate(tKey);
                        onNavigateHome();
                      } else {
                        onOpenPricing();
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isUnlocked ? '#2563eb' : '#a855f7',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {isUnlocked ? 'Use Template →' : <><Lock size={12} /> Unlock</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
