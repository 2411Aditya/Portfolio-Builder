import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';
import logoImg from '../assets/Logo.png';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'free';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle({ plan: selectedPlan });
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      if (selectedPlan === 'lite' || selectedPlan === 'pro') {
        navigate(`/dashboard?plan=${selectedPlan}&autoCheckout=true`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SEO
        title="Sign In | auoraa"
        description="Sign in to your auoraa account to manage your developer portfolios and access analytics."
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
                <div style={{ fontSize: 11, color: 'var(--color-mute)' }}>Proceed to Razorpay after sign in</div>
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

        <div className="eyebrow-uppercase-sm" style={{ textAlign: 'center', marginBottom: 6 }}>AUTHENTICATION</div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your developer dashboard</p>

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
          id="google-signin-btn"
          className="auth-google-btn"
          onClick={handleGoogleLogin}
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
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="auth-separator">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon"><Mail size={15} /></span>
              <input
                id="login-email"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={15} /></span>
              <input
                id="login-password"
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

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="button-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading
              ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#ffffff' }} />
              : <><span>Sign In</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to={`/register${selectedPlan !== 'free' ? `?plan=${selectedPlan}` : ''}`} id="login-to-register-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
