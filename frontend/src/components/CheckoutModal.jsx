import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Check, Zap, ShieldCheck, Bell, RefreshCw,
  Lock, CreditCard, AlertCircle, CheckCircle2, ArrowRight, Loader2
} from 'lucide-react';
import { trackEvent } from '../utils/tracking';

export default function CheckoutModal({ isOpen, onClose, initialPlan = 'monthly' }) {
  const [billingCycle, setBillingCycle] = useState(initialPlan); // 'monthly' | 'annual'
  const [autoRenewConsent, setAutoRenewConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const today = new Date();
  const trialEnd = new Date();
  trialEnd.setDate(today.getDate() + 7);
  const trialEndFormatted = trialEnd.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + 4);
  const reminderDateFormatted = reminderDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const price = billingCycle === 'annual' ? 96 : 12;
  const interval = billingCycle === 'annual' ? 'year' : 'month';
  const monthlyEquivalent = billingCycle === 'annual' ? 8 : 12;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!autoRenewConsent || !termsConsent) return;

    setProcessing(true);
    trackEvent('begin_checkout', { plan: billingCycle, price });

    // Simulate payment gateway tokenization
    await new Promise(resolve => setTimeout(resolve, 1200));

    setProcessing(false);
    setSuccess(true);
    trackEvent('purchase', { plan: billingCycle, price, trial: true });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
      <div className="checkout-modal-card" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close checkout modal"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="checkout-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={40} className="success-icon" />
            </div>
            <div className="eyebrow-uppercase-sm" style={{ color: '#15803d', marginBottom: 6 }}>PRO TRIAL ACTIVATED</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8 }}>
              Welcome to PortfolioAI Pro!
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.55, marginBottom: 20 }}>
              Your 7-day free trial is now active. We have sent a confirmation and free trial notice to your email.
            </p>

            <div className="checkout-trial-badge-box">
              <Bell size={16} style={{ color: 'var(--color-ink)', flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: 'var(--color-body)' }}>
                <strong>Reminder Scheduled:</strong> We will email you on <strong>{reminderDateFormatted}</strong> (3 days before trial ends on {trialEndFormatted}). You can cancel anytime from your dashboard.
              </div>
            </div>

            <button
              type="button"
              className="button-primary"
              style={{ width: '100%', marginTop: 24 }}
              onClick={onClose}
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout}>
            <div className="checkout-header">
              <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)' }}>UPGRADE TO PRO</div>
              <h2 id="checkout-modal-title" style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                Start Your 7-Day Free Trial
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-body)', marginTop: 4 }}>
                Unlock custom themes, SEO rich indexing, AI resume sync, and priority edge CDN hosting.
              </p>
            </div>

            {/* Plan Selector */}
            <div className="checkout-plan-toggle">
              <button
                type="button"
                className={`plan-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div style={{ fontWeight: 600 }}>Monthly Plan</div>
                <div style={{ fontSize: 12, color: 'var(--color-body)' }}>$12 / month</div>
              </button>
              <button
                type="button"
                className={`plan-toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
                onClick={() => setBillingCycle('annual')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Annual Plan</span>
                  <span className="badge-discount">SAVE 33%</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-body)' }}>$8 / mo ($96 billed yearly)</div>
              </button>
            </div>

            {/* Order Breakdown */}
            <div className="checkout-summary-box">
              <div className="checkout-summary-row">
                <span>7-Day Full Access Trial</span>
                <span style={{ fontWeight: 600, color: '#15803d' }}>$0.00</span>
              </div>
              <div className="checkout-summary-row">
                <span>Due Today</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-ink)' }}>$0.00</span>
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row subtext">
                <span>First Billing Date</span>
                <span>{trialEndFormatted}</span>
              </div>
              <div className="checkout-summary-row subtext">
                <span>Recurring Amount After Trial</span>
                <span>${price} / {interval} (auto-renews)</span>
              </div>
            </div>

            {/* Transparent Disclosures Box */}
            <div className="checkout-disclosure-box">
              <div className="disclosure-item">
                <Bell size={16} className="disclosure-icon" />
                <div>
                  <strong>Guaranteed Email Reminder:</strong> We will send you an email alert on <strong>{reminderDateFormatted}</strong> (3 days before your free trial expires) letting you know before any billing starts.
                </div>
              </div>
              <div className="disclosure-item">
                <RefreshCw size={16} className="disclosure-icon" />
                <div>
                  <strong>Automatic Renewal:</strong> After your 7-day trial ends on {trialEndFormatted}, your subscription automatically renews at ${price}/{interval} until cancelled.
                </div>
              </div>
              <div className="disclosure-item">
                <Check size={16} className="disclosure-icon" />
                <div>
                  <strong>Cancel Anytime With 1-Click:</strong> You can easily cancel at any time from your Account Settings. If you cancel before {trialEndFormatted}, your card will not be charged.
                </div>
              </div>
            </div>

            {/* Mandatory Explicit Checkboxes */}
            <div className="checkout-checkboxes">
              <label className="checkbox-label" htmlFor="checkout-auto-renew-consent">
                <input
                  id="checkout-auto-renew-consent"
                  type="checkbox"
                  required
                  checked={autoRenewConsent}
                  onChange={e => setAutoRenewConsent(e.target.checked)}
                  className="compliance-checkbox"
                />
                <span className="checkbox-text">
                  <strong>I acknowledge the Auto-Renewal & Free Trial Terms:</strong> My 7-day free trial will automatically convert to a recurring subscription at <strong>${price}/{interval}</strong> starting on {trialEndFormatted} unless cancelled prior. PortfolioAI will email me 3 days in advance.
                </span>
              </label>

              <label className="checkbox-label" htmlFor="checkout-terms-consent">
                <input
                  id="checkout-terms-consent"
                  type="checkbox"
                  required
                  checked={termsConsent}
                  onChange={e => setTermsConsent(e.target.checked)}
                  className="compliance-checkbox"
                />
                <span className="checkbox-text">
                  I agree to the <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--color-brand)' }}>Terms of Service</a> and have read the <Link to="/privacy" target="_blank" style={{ color: 'var(--color-brand)' }}>Privacy Policy & Data Disclosure</Link>.
                </span>
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={!autoRenewConsent || !termsConsent || processing}
              className="button-primary"
              style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 16 }}
            >
              {processing ? (
                <><Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing Trial Setup…</>
              ) : (
                <><Zap size={16} strokeWidth={2} /> Start 7-Day Free Trial ($0.00 Today)</>
              )}
            </button>

            <div className="checkout-trust-footer">
              <Lock size={12} />
              <span>256-Bit SSL Encrypted • Cancel Anytime in 1 Click • No Hidden Fees</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
