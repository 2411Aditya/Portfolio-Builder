import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';
import logoImg from '../assets/Logo.png';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || sessionStorage.getItem('pendingCheckoutPlan') || 'free';

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle({ plan: selectedPlan });
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      if (selectedPlan === 'lite' || selectedPlan === 'pro') {
        sessionStorage.setItem('pendingCheckoutPlan', selectedPlan);
      }
      await register(form);
      if (selectedPlan === 'lite' || selectedPlan === 'pro') {
        navigate(`/dashboard?plan=${selectedPlan}&autoCheckout=true`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reqs = [
    { label: 'Username 3–30 chars, alphanumeric / _', met: /^[a-zA-Z0-9_]{3,30}$/.test(form.username) },
    { label: 'Valid email address', met: /^[\w.-]+@[\w.-]+\.\w+$/.test(form.email) },
    { label: 'Password at least 6 characters', met: form.password.length >= 6 },
  ];
  const showReqs = form.username || form.email || form.password;

  return (
    <div className="auth-page">
      <SEO
        title="Create Account | auoraa"
        description="Create your free auoraa account to transform your resume into a stunning developer portfolio."
        noindex={true}
      />

      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={logoImg} alt="auoraa Logo" className="auth-logo-img" />
            <span className="auth-logo-text">auoraa</span>
          </Link>
        </div>

        {/* Selected Plan Banner if Paid */}
        {selectedPlan !== 'free' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: selectedPlan === 'pro' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(99, 102, 241, 0.12))' : 'rgba(2, 132, 199, 0.12)',
              border: selectedPlan === 'pro' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(2, 132, 199, 0.3)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedPlan === 'pro' ? <Sparkles size={16} style={{ color: '#a855f7' }} /> : <ShieldCheck size={16} style={{ color: '#0284c7' }} />}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)' }}>
                  Selected: {selectedPlan === 'pro' ? 'Pro Visionary (₹29/mo)' : 'Lite Creator (₹19/mo)'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-mute)' }}>Proceed to Razorpay after account creation</div>
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 4,
                background: selectedPlan === 'pro' ? '#a855f7' : '#0284c7',
                color: '#fff',
              }}
            >
              {selectedPlan.toUpperCase()}
            </span>
          </div>
        )}

        <div className="eyebrow-uppercase-sm" style={{ textAlign: 'center', marginBottom: 6 }}>GET STARTED</div>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Build your AI portfolio in seconds</p>

        {error && (
          <div className="err-banner">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Dismiss error">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          id="google-signup-btn"
          className="auth-google-btn"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Sign up with Google</span>
            </>
          )}
        </button>

        <div className="auth-separator">
          <span>or register with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-username">Username</label>
            <div className="input-wrap">
              <span className="input-icon"><User size={15} /></span>
              <input
                id="register-username"
                type="text"
                required
                placeholder="johndoe"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="form-input has-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon"><Mail size={15} /></span>
              <input
                id="register-email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="form-input has-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={15} /></span>
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="form-input has-icon"
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPass(!showPass)}
                role="button"
                tabIndex={0}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            </div>
          </div>

          {showReqs && (
            <div className="req-list" style={{ marginBottom: 16 }}>
              {reqs.map((r, i) => (
                <div key={i} className={`req-item ${r.met ? 'met' : ''}`}>
                  <CheckCircle size={12} />
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <div style={{ margin: '14px 0 16px' }}>
            <label className="checkbox-label" htmlFor="register-terms-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                id="register-terms-consent"
                type="checkbox"
                required
                checked={agreeConsent}
                onChange={e => setAgreeConsent(e.target.checked)}
                className="compliance-checkbox"
                style={{ marginTop: 3 }}
              />
              <span style={{ fontSize: 12, color: 'var(--color-body)', lineHeight: 1.45 }}>
                I agree to the <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}>Terms of Service</a> and have read and accept the <Link to="/privacy" target="_blank" style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}>Privacy Policy & Data Disclosure</Link>.
              </span>
            </label>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading || !agreeConsent}
            className="button-primary"
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading
              ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#ffffff' }} />
              : <><span>Create Account</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to={`/login${selectedPlan !== 'free' ? `?plan=${selectedPlan}` : ''}`} id="register-to-login-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
