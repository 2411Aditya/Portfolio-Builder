import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, Zap, Moon, Sun, Copy, ExternalLink, Trash2, FileText,
  AlertCircle, LogOut, Clock, Loader2, X, Globe, Check,
  LayoutDashboard, ShieldCheck, CheckCircle, Sparkles, Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/client';
import SEO from '../components/SEO';
import CheckoutModal from '../components/CheckoutModal';

const ACCEPTED = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

const STEPS = [
  'Parsing document structure & typography…',
  'Extracting skills, projects & experience…',
  'Styling live responsive portfolio…',
];

/* ── Delete Confirmation Modal (Level 4 Heavy Shadow) ── */
function DeleteModal({ portfolioTitle, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: 4, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={20} strokeWidth={1.5} style={{ color: '#ee1d36' }} />
        </div>
        <div className="eyebrow-uppercase-sm" style={{ color: '#ee1d36', marginBottom: 4 }}>CONFIRM DELETION</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>Delete Portfolio</div>
        <div style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.5, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--color-ink)' }}>"{portfolioTitle}"</strong>? The public permalink will stop working immediately.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="button-secondary" style={{ flex: 1 }} onClick={onCancel} type="button">
            Cancel
          </button>
          <button
            className="button-primary"
            style={{ flex: 1, backgroundColor: '#ee1d36', borderColor: '#ee1d36' }}
            onClick={onConfirm}
            disabled={deleting}
            type="button"
          >
            {deleting ? <><Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio Card (Webflow 8px Chrome & 4px Action Buttons) ── */
function PortfolioCard({ portfolio, onDelete, onCopyLink }) {
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(portfolio.id);
    setDeleting(false);
    setShowDeleteModal(false);
  };

  const handleCopy = () => {
    onCopyLink(portfolio.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          portfolioTitle={portfolio.title}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
      <div className="port-card">
        <div>
          <div className="port-card-top">
            <div className="port-card-title" title={portfolio.title}>{portfolio.title}</div>
            <div className="port-card-actions">
              <Link to={portfolio.public_url} target="_blank" className="port-action preview" title="Open live portfolio" aria-label="Open live portfolio">
                <ExternalLink size={14} strokeWidth={1.5} />
              </Link>
              <button onClick={handleCopy} className="port-action copy" title="Copy public link" aria-label="Copy public link" type="button">
                {copied
                  ? <Check size={14} strokeWidth={2.5} style={{ color: '#15803d' }} />
                  : <Copy size={14} strokeWidth={1.5} />
                }
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="port-action delete" title="Delete portfolio" aria-label="Delete portfolio" type="button">
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="port-meta">
            <span className="port-status-badge">
              <span className="port-status-dot" />
              Live
            </span>
            <span className="theme-badge">
              {portfolio.theme === 'dark'
                ? <Moon size={11} strokeWidth={1.5} />
                : <Sun size={11} strokeWidth={1.5} />
              }
              {portfolio.theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <span className="port-date">
              <Clock size={11} strokeWidth={1.5} />
              {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="port-url">{window.location.origin}{portfolio.public_url}</div>
      </div>
    </>
  );
}

/* ── Main Dashboard Page ── */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [error, setError] = useState('');
  const [newPortfolio, setNewPortfolio] = useState(null);

  const [portfolios, setPortfolios] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const fileInputRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await api.getHistory();
      setPortfolios(res.data.portfolios || []);
    } catch {
      setHistoryError('Failed to load portfolios.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleLogout = () => { logout(); navigate('/'); };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) validateAndSetFile(f); };
  const onFileChange = (e) => { if (e.target.files[0]) validateAndSetFile(e.target.files[0]); };

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) { setError(`Unsupported file ".${ext}". Use: ${ACCEPTED.join(', ')}`); return; }
    if (f.size > 16 * 1024 * 1024) { setError('File too large. Max 16 MB.'); return; }
    setError(''); setFile(f); setNewPortfolio(null);
  };

  const handleGenerate = async () => {
    if (!file) { setError('Please select a resume file first.'); return; }
    setGenerating(true); setError(''); setNewPortfolio(null); setGenStep(0);

    const stepTimer = setInterval(() => {
      setGenStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(stepTimer);
        return prev;
      });
    }, 700);

    try {
      const res = await api.generatePortfolio({ file, theme });
      clearInterval(stepTimer);
      setGenStep(STEPS.length - 1);
      setNewPortfolio(res.data.portfolio);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchHistory();
    } catch (err) {
      clearInterval(stepTimer);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
      setGenStep(-1);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
      if (newPortfolio?.id === id) setNewPortfolio(null);
    } catch (err) {
      alert(err.message || 'Failed to delete portfolio.');
    }
  };

  const handleCopyLink = (url) => { navigator.clipboard.writeText(window.location.origin + url); };

  return (
    <div className="dash-shell">
      <SEO
        title="Dashboard | PortfolioAI"
        description="Manage your generated portfolios, generate new portfolios from resumes, and monitor your public links."
        noindex={true}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialPlan="monthly"
      />

      {/* Navbar */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/" className="nav-brand">
            <span>PortfolioAI</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="button-primary"
              style={{ padding: '7px 14px', fontSize: 13, gap: 6 }}
            >
              <Sparkles size={14} /> Upgrade to Pro (7-Day Trial)
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#f5f5f5', border: '1px solid #d8d8d8', borderRadius: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 2, background: '#080808', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink)' }}>{user?.username}</span>
            </div>
            <button id="dashboard-logout-btn" onClick={handleLogout} className="button-secondary" style={{ padding: '7px 12px', fontSize: 13 }} type="button">
              <LogOut size={13} strokeWidth={1.5} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Header Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 4 }}>DASHBOARD OVERVIEW</div>
            <h1 className="display-sm" style={{ fontWeight: 600 }}>
              Welcome back, {user?.username}
            </h1>
            <p className="body-sm" style={{ marginTop: 2 }}>
              Generate, manage, and monitor recruiter-ready portfolio links.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-green-soft" style={{ padding: '6px 10px' }}>
              <ShieldCheck size={14} /> Free Starter Plan
            </span>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="button-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              Billing & Trial Info
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>TOTAL PORTFOLIOS</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>{portfolios.length}</div>
          </div>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>ACTIVE LINKS</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#15803d' }}>{portfolios.length} Live</div>
          </div>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>GENERATION SPEED</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-accent-blue-deep)' }}>~30s</div>
          </div>
        </div>

        {/* Generator Card & History Grid */}
        <div className="dash-grid">
          {/* Left Column: Generator Form */}
          <div className="dash-card">
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 4 }}>INSTANT GENERATOR</div>
            <div className="dash-card-title">Generate New Portfolio</div>
            <div className="dash-card-sub">Upload a resume to create a live public profile.</div>

            {/* Error Banner */}
            {error && (
              <div className="err-banner">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
                <button type="button" onClick={() => setError('')}><X size={13} /></button>
              </div>
            )}

            {/* Success Banner */}
            {newPortfolio && (
              <div style={{ padding: 16, borderRadius: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#15803d', fontSize: 13, marginBottom: 8 }}>
                  <CheckCircle size={15} /> Portfolio Generated Successfully!
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160, padding: '6px 10px', borderRadius: 4, background: '#ffffff', border: '1px solid #d8d8d8', color: 'var(--color-ink)', fontSize: 11, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {window.location.origin}{newPortfolio.public_url}
                  </div>
                  <button className="button-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => handleCopyLink(newPortfolio.public_url)} type="button">
                    <Copy size={12} /> Copy
                  </button>
                  <Link to={newPortfolio.public_url} target="_blank" className="button-primary" style={{ padding: '6px 10px', fontSize: 12 }}>
                    <ExternalLink size={12} /> View
                  </Link>
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div
              id="file-drop-zone"
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              style={{ padding: '24px 16px', marginBottom: 16 }}
            >
              <input ref={fileInputRef} id="resume-file-input" type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" style={{ display: 'none' }} onChange={onFileChange} />
              {file ? (
                <div>
                  <FileText size={24} style={{ color: 'var(--color-ink)', margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink)' }}>{file.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-mute)', marginBottom: 8 }}>{(file.size / 1024).toFixed(0)} KB</div>
                  <button className="button-secondary" style={{ padding: '3px 8px', fontSize: 11 }} onClick={e => { e.stopPropagation(); setFile(null); }} type="button">
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <div className="drop-upload-icon" style={{ width: 36, height: 36, marginBottom: 8 }}>
                    <Upload size={16} style={{ color: 'var(--color-ink)' }} />
                  </div>
                  <div className="drop-main" style={{ fontSize: 13 }}>Click to browse or drop resume</div>
                  <div className="drop-sub" style={{ fontSize: 11, marginBottom: 0 }}>PDF, DOCX, TXT (Max 16 MB)</div>
                </div>
              )}
            </div>

            {/* Visual Template Selector */}
            <div className="form-group">
              <label className="form-label">Visual Template</label>
              <div className="theme-seg" style={{ margin: 0 }}>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={13} /> Light Canvas
                </button>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={13} /> Dark Terminal
                </button>
              </div>
            </div>

            {/* Progress Stepper */}
            {generating && (
              <div className="progress-steps" style={{ marginBottom: 14 }}>
                {STEPS.map((s, i) => (
                  <div key={i} className={`progress-step ${i === genStep ? 'active' : i < genStep ? 'done' : ''}`}>
                    <div className="progress-step-icon">
                      {i < genStep ? <Check size={11} strokeWidth={3} /> : i === genStep ? <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> : i + 1}
                    </div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              id="generate-portfolio-btn"
              onClick={handleGenerate}
              disabled={generating || !file}
              className="button-primary"
              style={{ width: '100%', marginTop: 8 }}
              type="button"
            >
              {generating ? <><Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing Resume…</> : <><Zap size={14} /> Extract & Generate Portfolio</>}
            </button>
          </div>

          {/* Right Column: Public Portfolios Listing */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="eyebrow-uppercase-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={14} />
                PUBLIC PORTFOLIOS ({portfolios.length})
              </div>
            </div>

            {historyLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                <div className="spinner" style={{ width: 28, height: 28 }} />
              </div>
            ) : historyError ? (
              <p style={{ textAlign: 'center', color: '#ee1d36', padding: '30px 0', fontSize: 13 }}>{historyError}</p>
            ) : portfolios.length === 0 ? (
              <div className="dash-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: '#f5f5f5', border: '1px solid #d8d8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <LayoutDashboard size={20} style={{ color: 'var(--color-mute)' }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>No portfolios yet</div>
                <p className="body-sm">Upload a resume using the form to generate your first live portfolio link.</p>
              </div>
            ) : (
              <div className="port-grid">
                {portfolios.map(p => (
                  <PortfolioCard key={p.id} portfolio={p} onDelete={handleDelete} onCopyLink={handleCopyLink} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
