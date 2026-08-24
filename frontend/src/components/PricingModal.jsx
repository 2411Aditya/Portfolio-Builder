import React, { useState } from 'react';
import {
  X, Check, Zap, Sparkles, ShieldCheck, Lock,
  CreditCard, Loader2, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder, verifyAndUpgradeTier } from '../utils/razorpay';

export default function PricingModal({ isOpen, onClose, initialTier = 'pro', onSuccess }) {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedTier, setSelectedTier] = useState(initialTier); // 'lite' | 'pro'
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successTier, setSuccessTier] = useState(null);

  if (!isOpen) return null;

  const currentTier = profile?.plan_tier || 'free';

  const PLANS = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '₹0',
      period: 'forever',
      amount: 0,
      description: 'Essential developer portfolio for students and job seekers.',
      features: [
        '2 Classic Templates (Minimal & Terminal)',
        'AI Resume Parsing',
        'Instant Public URL (/p/username/id)',
        'Unlimited Profile Views',
      ],
      cta: currentTier === 'free' ? 'Current Plan' : 'Free Tier',
      disabled: true,
      popular: false,
    },
    {
      id: 'lite',
      name: 'Lite Creator',
      price: '₹99',
      period: 'one-time',
      amount: 9900,
      description: 'Modern visual designs to stand out in recruiter inboxes.',
      features: [
        '6 Dynamic Templates (Bento, Executive, Creative Bold, Split Screen + Free)',
        'Dynamic Grid & Bento Layouts',
        'Corporate & Creative Themes',
        'Priority Public CDN Hosting',
        'Direct WhatsApp & Social Links',
      ],
      cta: currentTier === 'lite' ? 'Current Plan' : 'Upgrade to Lite',
      disabled: currentTier === 'lite' || currentTier === 'pro',
      popular: false,
      badge: 'POPULAR CHOICE',
    },
    {
      id: 'pro',
      name: 'Pro Visionary',
      price: '₹299',
      period: 'lifetime access',
      amount: 29900,
      description: 'Maximum impact with all 10 templates and AI Customizer.',
      features: [
        'All 10 Modular Templates (Glassmorphism, Timeline Story, Notion Doc, Neumorphic, etc.)',
        'AI-Driven Customization Chatbox',
        'Natural Language UI & Style Overrides',
        'Custom Color & Font Palette Tuning',
        'Verified Pro Badge on Live Link',
        'SEO Rich Snippets & JSON-LD Schemas',
      ],
      cta: currentTier === 'pro' ? 'Current Plan' : 'Unlock All 10 + AI',
      disabled: currentTier === 'pro',
      popular: true,
      badge: 'BEST VALUE • UNLIMITED AI',
    },
  ];

  const handleCheckout = async (tierId) => {
    if (tierId === 'free' || tierId === currentTier) return;
    setError('');
    setProcessing(true);

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your network.');
      }

      // 2. Create Order
      const orderData = await createRazorpayOrder(tierId);
      const userEmail = user?.email || '';
      const userName = user?.username || userEmail.split('@')[0] || 'User';

      // 3. Configure Razorpay Options
      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'PortfolioAI Builder',
        description: `${tierId.toUpperCase()} Plan Upgrade`,
        order_id: orderData.orderId.startsWith('order_mock') ? undefined : orderData.orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response) => {
          try {
            await verifyAndUpgradeTier(tierId, response);
            if (refreshProfile) await refreshProfile();
            setSuccessTier(tierId);
            if (onSuccess) onSuccess(tierId);
          } catch (err) {
            console.error('Upgrade sync error:', err);
            setSuccessTier(tierId);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          setError(response.error?.description || 'Payment was unsuccessful.');
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Mock success in dev if Razorpay object not initialized
        await verifyAndUpgradeTier(tierId);
        if (refreshProfile) await refreshProfile();
        setSuccessTier(tierId);
        if (onSuccess) onSuccess(tierId);
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          maxWidth: 980,
          width: '100%',
          padding: '36px 32px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {successTier ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em', marginBottom: 6 }}>
              UPGRADE SUCCESSFUL
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              Welcome to PortfolioAI {successTier.toUpperCase()}!
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Your account has been upgraded. All {successTier === 'pro' ? '10 templates and AI Customizer' : 'Lite templates'} are now unlocked.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={onClose}
              style={{ padding: '12px 32px', fontSize: 15, borderRadius: 12 }}
            >
              Start Customizing
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                <Sparkles size={14} /> TRANSPARENT TIER ACCESS
              </div>
              <h2 id="pricing-modal-title" style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Upgrade Your Portfolio Experience
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, maxWidth: 580, margin: '0 auto' }}>
                Pick the tier that fits your goals. One-time payment, instant unlock, with zero recurring surprises.
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 20, textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Pricing Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
              {PLANS.map((plan) => {
                const isSelected = selectedTier === plan.id;
                return (
                  <div
                    key={plan.id}
                    style={{
                      background: plan.popular ? 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' : '#ffffff',
                      border: plan.popular ? '2px solid #6366f1' : '1px solid #e2e8f0',
                      borderRadius: 20,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: plan.popular ? '0 12px 30px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    {plan.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: plan.popular ? '#6366f1' : '#0284c7',
                          color: '#ffffff',
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{plan.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                        <span style={{ fontSize: 13, color: '#64748b' }}>/{plan.period}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                        {plan.description}
                      </p>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: 12, letterSpacing: '0.04em' }}>
                          What's Included:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {plan.features.map((feat, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#334155', lineHeight: 1.4 }}>
                              <Check size={15} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={plan.disabled || processing}
                      onClick={() => handleCheckout(plan.id)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: 'none',
                        background: plan.disabled
                          ? '#f1f5f9'
                          : plan.popular
                          ? '#6366f1'
                          : '#0f172a',
                        color: plan.disabled ? '#94a3b8' : '#ffffff',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: plan.disabled ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: !plan.disabled && plan.popular ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {processing && selectedTier === plan.id ? (
                        <>
                          <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing...
                        </>
                      ) : (
                        <>
                          {plan.id === 'pro' && <Sparkles size={15} />}
                          {plan.cta}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Reassurances */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 18, color: '#64748b', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} style={{ color: '#16a34a' }} /> 100% Secure via Razorpay
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCard size={15} style={{ color: '#6366f1' }} /> UPI, Cards, NetBanking, Wallets
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={15} style={{ color: '#f59e0b' }} /> Instant Feature Activation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
