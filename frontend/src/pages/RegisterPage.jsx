import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
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
        title="Create Account | PortfolioAI"
        description="Create your free PortfolioAI account to transform your resume into a stunning developer portfolio."
        noindex={true}
      />

      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="auth-logo-text">PortfolioAI</span>
          </Link>
        </div>

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

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="button-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading
              ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#ffffff' }} />
              : <><span>Create Account</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="register-to-login-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
