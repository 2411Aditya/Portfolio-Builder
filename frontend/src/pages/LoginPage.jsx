import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

export default function LoginPage() {
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SEO
        title="Sign In | PortfolioAI"
        description="Sign in to your PortfolioAI account to manage your developer portfolios and access analytics."
        noindex={true}
      />
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="auth-logo-text grad">PortfolioAI</span>
          </Link>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        {error && (
          <div className="err-banner">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={15} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrap">
              <span className="input-icon"><Mail size={16} /></span>
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={16} /></span>
              <input
                id="login-password"
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

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-grad form-submit"
          >
            {loading
              ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : <><span>Sign In</span><ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" id="login-to-register-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
