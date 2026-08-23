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
    { label: 'Username 3–30 chars, letters/numbers/_', met: /^[a-zA-Z0-9_]{3,30}$/.test(form.username) },
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
      <div className="auth-orb-1" style={{ top: '15%', left: '25%', background: 'rgba(139,92,246,0.13)' }} />
      <div className="auth-orb-2" style={{ bottom: '15%', right: '25%', background: 'rgba(6,182,212,0.1)' }} />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="auth-logo-text grad">PortfolioAI</span>
          </Link>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Build your AI portfolio in minutes</p>

        {error && (
          <div className="err-banner">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={15} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrap">
              <span className="input-icon"><User size={16} /></span>
              <input
                id="register-username"
                type="text"
                required
                placeholder="johndoe"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="form-input no-right-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrap">
              <span className="input-icon"><Mail size={16} /></span>
              <input
                id="register-email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="form-input no-right-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={16} /></span>
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="form-input"
              />
              <span className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>

          {showReqs && (
            <div className="req-list" style={{ marginBottom: 14 }}>
              {reqs.map((r, i) => (
                <div key={i} className={`req-item ${r.met ? 'met' : ''}`}>
                  <CheckCircle size={13} />
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-grad form-submit"
          >
            {loading
              ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : <><span>Create Account</span><ArrowRight size={16} /></>
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
