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
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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
                  Selected: {selectedPlan === 'pro' ? 'Pro Visionary (₹29/yr)' : 'Lite Creator (₹19/yr)'}
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
