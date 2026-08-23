import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Settings, Check, X, Lock, BarChart3, Target, AlertCircle } from 'lucide-react';
import { getSavedConsent, saveConsent, applyTracking, DEFAULT_CONSENT } from '../utils/tracking';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already configured consent
    const current = getSavedConsent();
    if (!current.configured) {
      // Show banner after brief natural delay
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      applyTracking(current);
    }

    // Listen for custom reopen event from footer or settings
    const handleReopen = () => {
      const saved = getSavedConsent();
      setPreferences({
        necessary: true,
        analytics: saved.analytics,
        marketing: saved.marketing
      });
      setModalOpen(true);
    };

    window.addEventListener('openCookieSettings', handleReopen);
    return () => window.removeEventListener('openCookieSettings', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setVisible(false);
    setModalOpen(false);
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
    setVisible(false);
    setModalOpen(false);
  };

  const handleSavePreferences = () => {
    saveConsent({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing
    });
    setVisible(false);
    setModalOpen(false);
  };

  const openPreferencesModal = () => {
    const saved = getSavedConsent();
    setPreferences({
      necessary: true,
      analytics: saved.analytics,
      marketing: saved.marketing
    });
    setModalOpen(true);
  };

  return (
    <>
      {/* ── Floating Consent Banner ── */}
      {visible && !modalOpen && (
        <div className="cookie-banner-wrap" role="region" aria-label="Cookie and Tracking Consent">
          <div className="cookie-banner-inner">
            <div className="cookie-banner-content">
              <div className="cookie-banner-header">
                <div className="cookie-icon-badge">
                  <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="cookie-banner-title">Cookie & Tracking Choices</h3>
                  <p className="cookie-banner-text">
                    We use cookies and privacy-respecting analytics (including Google Analytics and Meta Pixel) 
                    to improve platform performance, analyze resume generation workflows, and optimize campaigns. 
                    You can accept all, reject non-essential tracking, or customize your preferences anytime. 
                    Read our <Link to="/privacy" className="cookie-link">Privacy Policy & Data Disclosure</Link>.
                  </p>
                </div>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                onClick={openPreferencesModal}
                className="button-secondary cookie-btn-sm"
                aria-label="Customize cookie and tracking settings"
              >
                <Settings size={14} />
                <span>Customize</span>
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="button-secondary cookie-btn-sm"
                aria-label="Reject non-essential cookies"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="button-primary cookie-btn-sm"
                aria-label="Accept all cookies and tracking"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>Accept All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Granular Preferences Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="cookie-modal-card" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
            <div className="cookie-modal-header">
              <div>
                <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)' }}>PRIVACY & TRACKING PREFERENCES</div>
                <h2 id="cookie-modal-title" style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                  Customize Consent Settings
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close preferences modal"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5, marginBottom: 20 }}>
              Control how PortfolioAI collects and processes your telemetry. You can update these settings at any point via the "Cookie Settings" link in the footer.
            </p>

            {/* Category 1: Strictly Necessary */}
            <div className="consent-category-card active">
              <div className="consent-cat-header">
                <div className="consent-cat-title-wrap">
                  <div className="consent-cat-icon"><Lock size={15} /></div>
                  <div>
                    <div className="consent-cat-title">Strictly Necessary Cookies</div>
                    <div className="consent-cat-sub">Essential for authentication, security tokens, and state preservation.</div>
                  </div>
                </div>
                <span className="badge-locked">Always Active</span>
              </div>
            </div>

            {/* Category 2: Performance & Analytics (Google Analytics) */}
            <label className={`consent-category-card ${preferences.analytics ? 'active' : ''}`} htmlFor="consent-analytics">
              <div className="consent-cat-header">
                <div className="consent-cat-title-wrap">
                  <div className="consent-cat-icon"><BarChart3 size={15} /></div>
                  <div>
                    <div className="consent-cat-title">Google Analytics & Telemetry</div>
                    <div className="consent-cat-sub">
                      Allows us to track anonymous page views, resume processing speed, and error telemetry to improve user experience.
                    </div>
                  </div>
                </div>
                <div className="consent-switch-wrap">
                  <input
                    id="consent-analytics"
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={e => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="consent-checkbox"
                  />
                </div>
              </div>
            </label>

            {/* Category 3: Marketing & Meta Pixel */}
            <label className={`consent-category-card ${preferences.marketing ? 'active' : ''}`} htmlFor="consent-marketing">
              <div className="consent-cat-header">
                <div className="consent-cat-title-wrap">
                  <div className="consent-cat-icon"><Target size={15} /></div>
                  <div>
                    <div className="consent-cat-title">Meta Pixel & Conversion Tracking</div>
                    <div className="consent-cat-sub">
                      Enables campaign attribution and audience measurements across Meta (Facebook & Instagram) ads.
                    </div>
                  </div>
                </div>
                <div className="consent-switch-wrap">
                  <input
                    id="consent-marketing"
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={e => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="consent-checkbox"
                  />
                </div>
              </div>
            </label>

            <div className="consent-modal-disclosure">
              <AlertCircle size={14} style={{ flexShrink: 0, color: 'var(--color-body)' }} />
              <span>
                By saving, your choices are stored securely in your browser. For full details on our data governance, see our{' '}
                <Link to="/privacy" onClick={() => setModalOpen(false)} style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
                  Privacy Policy & Data Disclosure
                </Link>.
              </span>
            </div>

            <div className="cookie-modal-footer">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="button-secondary"
                style={{ fontSize: 13 }}
              >
                Reject All Non-Essential
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="button-secondary"
                  style={{ fontSize: 13, borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
                >
                  Save Choices
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="button-primary"
                  style={{ fontSize: 13 }}
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
