import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload, Zap, Moon, Sun, Copy, ExternalLink, Trash2, FileText,
  AlertCircle, LogOut, Clock, Loader2, X, Globe, Check,
  LayoutDashboard, ShieldCheck, CheckCircle, Sparkles, Lock, Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/client';
import SEO from '../components/SEO';
import PricingModal from '../components/PricingModal';
import { TEMPLATE_REGISTRY, canAccessTemplate } from '../templates';
import logoImg from '../assets/Logo.png';

const ACCEPTED = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

const STEPS = [
  'Parsing document structure & typography…',
  'Extracting skills, projects & experience…',
  'Styling live responsive portfolio…',
];

/* ── Delete Confirmation Modal ── */
function DeleteModal({ portfolioTitle, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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

/* ── Portfolio Card with Template Badge ── */
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

  const templateMeta = TEMPLATE_REGISTRY[portfolio.template_id] || TEMPLATE_REGISTRY.minimal;

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
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: `${templateMeta.thumbnailColor}18`,
                color: templateMeta.thumbnailColor,
                border: `1px solid ${templateMeta.thumbnailColor}33`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Palette size={11} /> {templateMeta.name}
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
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const userTier = profile?.plan_tier || 'free';

  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [error, setError] = useState('');
  const [newPortfolio, setNewPortfolio] = useState(null);

  const [portfolios, setPortfolios] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [pricingOpen, setPricingOpen] = useState(false);
  const [targetTierForUpgrade, setTargetTierForUpgrade] = useState('pro');
  const [autoTriggerCheckout, setAutoTriggerCheckout] = useState(false);
  const autoCheckoutTriggeredRef = useRef(false);

  const fileInputRef = useRef(null);

  // Auto-trigger Razorpay modal pipeline if user arrived from register/login with a paid plan
  useEffect(() => {
    const pendingPlan = sessionStorage.getItem('pendingCheckoutPlan') || searchParams.get('plan');
    const isAutoCheckout = searchParams.get('autoCheckout') === 'true' || !!sessionStorage.getItem('pendingCheckoutPlan');

    if (isAutoCheckout && (pendingPlan === 'lite' || pendingPlan === 'pro') && !autoCheckoutTriggeredRef.current) {
      autoCheckoutTriggeredRef.current = true;
      sessionStorage.removeItem('pendingCheckoutPlan');
      setTargetTierForUpgrade(pendingPlan);
      setAutoTriggerCheckout(true);
      setPricingOpen(true);
    }
  }, [searchParams]);

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

  const handleSelectTemplate = (templateKey, templateMeta) => {
    const isAccessible = canAccessTemplate(userTier, templateMeta.tier);
    if (!isAccessible) {
      setTargetTierForUpgrade(templateMeta.tier);
      setPricingOpen(true);
      return;
    }
    setSelectedTemplate(templateKey);
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
      const res = await api.generatePortfolio({
        file,
        theme,
        templateId: selectedTemplate,
      });
      clearInterval(stepTimer);
      setGenStep(STEPS.length - 1);
      setNewPortfolio(res.data);
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

  const getTierBadge = () => {
    if (userTier === 'pro') {
      return (
        <span style={{ padding: '6px 12px', borderRadius: 9999, background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} /> Pro Visionary
        </span>
      );
    }
    if (userTier === 'lite') {
      return (
        <span style={{ padding: '6px 12px', borderRadius: 9999, background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(2, 132, 199, 0.3)' }}>
          <ShieldCheck size={14} /> Lite Creator
        </span>
      );
    }
    return (
      <span className="badge-green-soft" style={{ padding: '6px 12px' }}>
        <ShieldCheck size={14} /> Free Starter Plan
      </span>
    );
  };

  return (
    <div className="dash-shell">
      <SEO
        title="Dashboard | auoraa"
        description="Manage your generated portfolios, select modular templates, and customize themes."
        noindex={true}
      />
      
      {/* Razorpay Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        initialTier={targetTierForUpgrade}
      />

      {/* Navbar */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/" className="nav-brand">
            <img src={logoImg} alt="auoraa Logo" className="brand-logo" />
            <span>auoraa</span>
          </Link>
          <div className="dash-header-actions">
            {userTier !== 'pro' && (
              <button
                type="button"
                onClick={() => {
                  setTargetTierForUpgrade('pro');
                  setPricingOpen(true);
                }}
                className="button-primary dash-upgrade-btn"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)',
                }}
              >
                <Sparkles size={13} />
                <span>{userTier === 'lite' ? 'Upgrade to Pro' : 'Unlock Pro (₹299)'}</span>
              </button>
            )}
            <div className="dash-user-badge">
              <div className="dash-user-avatar">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="dash-user-name">{user?.username}</span>
            </div>
            <button id="dashboard-logout-btn" onClick={handleLogout} className="button-secondary dash-logout-btn" type="button" title="Logout">
              <LogOut size={13} strokeWidth={1.5} />
              <span className="logout-text">Logout</span>
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
              Generate, manage, and customize your live portfolio links across 10 modular templates.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {getTierBadge()}
            {userTier !== 'pro' && (
              <button
                type="button"
                onClick={() => {
                  setTargetTierForUpgrade('pro');
                  setPricingOpen(true);
                }}
                className="button-secondary"
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                View Plans & Pricing
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>TOTAL PORTFOLIOS</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>{portfolios.length}</div>
          </div>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>AVAILABLE TEMPLATES</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#15803d' }}>
              {userTier === 'pro' ? '10/10 (All Unlocked)' : userTier === 'lite' ? '6/10 (Lite)' : '2/10 (Free)'}
            </div>
          </div>
          <div className="dash-card" style={{ padding: 20 }}>
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 6 }}>AI CUSTOMIZER</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: userTier === 'pro' ? '#a855f7' : 'var(--color-mute)' }}>
              {userTier === 'pro' ? 'Active' : 'Locked (Pro)'}
            </div>
          </div>
        </div>

        {/* Generator Card & History Grid */}
        <div className="dash-grid">
          
          {/* Left Column: Generator Form */}
          <div className="dash-card">
            <div className="eyebrow-uppercase-sm" style={{ marginBottom: 4 }}>INSTANT GENERATOR</div>
            <div className="dash-card-title">Generate New Portfolio</div>
            <div className="dash-card-sub">Upload your resume and choose from 10 modular designs.</div>

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
              <div style={{ padding: 16, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
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
              style={{ padding: '20px 16px', marginBottom: 16 }}
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
                  <div className="drop-sub" style={{ fontSize: 11, marginBottom: 0 }}>PDF, DOCX, TXT, PNG (Max 16 MB)</div>
                </div>
              )}
            </div>

            {/* 10-Template Visual Grid Selector */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>Select Template (10 Available)</label>
                <span style={{ fontSize: 11, color: 'var(--color-mute)' }}>
                  Selected: <strong style={{ color: 'var(--color-ink)' }}>{TEMPLATE_REGISTRY[selectedTemplate]?.name}</strong>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                {Object.entries(TEMPLATE_REGISTRY).map(([tKey, tMeta]) => {
                  const isAccessible = canAccessTemplate(userTier, tMeta.tier);
                  const isSelected = selectedTemplate === tKey;

                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => handleSelectTemplate(tKey, tMeta)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 8,
                        border: isSelected ? `2px solid ${tMeta.thumbnailColor}` : '1px solid #e2e8f0',
                        background: isSelected ? `${tMeta.thumbnailColor}0a` : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 5px',
                              borderRadius: 4,
                              background: tMeta.tier === 'pro' ? '#a855f7' : tMeta.tier === 'lite' ? '#0284c7' : '#10b981',
                              color: '#ffffff',
                            }}
                          >
                            {tMeta.tier}
                          </span>
                          {!isAccessible && (
                            <Lock size={12} style={{ color: '#94a3b8' }} />
                          )}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2, marginTop: 4 }}>
                          {tMeta.name}
                        </div>
                      </div>

                      <div style={{ height: 4, borderRadius: 2, background: tMeta.thumbnailColor, marginTop: 8, opacity: isSelected ? 1 : 0.4 }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Theme Segments (Dark / Light) */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Base Theme</label>
              <div className="theme-seg" style={{ margin: 0 }}>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={13} /> Dark Mode
                </button>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={13} /> Light Canvas
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

      {/* ── Pricing & Upgrade Modal with Razorpay ── */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => {
          setPricingOpen(false);
          setAutoTriggerCheckout(false);
          setSearchParams({}, { replace: true });
        }}
        initialTier={targetTierForUpgrade}
        autoTrigger={autoTriggerCheckout}
      />
    </div>
  );
}
