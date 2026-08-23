import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, Zap, Moon, Sun, Copy, ExternalLink, Trash2, FileText,
  Image, CheckCircle, AlertCircle, LogOut, Clock, Loader2, X,
  Globe, Check, LayoutDashboard, Plus, Sparkles, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/client';
import SEO from '../components/SEO';

const ACCEPTED = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

const STEPS = [
  'Parsing document structure…',
  'Extracting skills & experience…',
  'Styling live portfolio…',
];

/* ── Delete Confirmation Modal ── */
function DeleteModal({ portfolioTitle, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Trash2 size={20} strokeWidth={1.5} style={{ color: '#dc2626' }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Delete Portfolio</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
          Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{portfolioTitle}"</strong>? The public link will stop working immediately.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, background: '#dc2626', borderColor: '#b91c1c' }} onClick={onConfirm} disabled={deleting}>
            {deleting ? <><Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio Card (Dribbble Style) ── */
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
        <div className="port-card-top">
          <div className="port-card-title" title={portfolio.title}>{portfolio.title}</div>
          <div className="port-card-actions">
            <Link to={portfolio.public_url} target="_blank" className="port-action preview" title="Open portfolio">
              <ExternalLink size={14} strokeWidth={1.5} />
            </Link>
            <button onClick={handleCopy} className="port-action copy" title="Copy link">
              {copied
                ? <Check size={14} strokeWidth={2.5} style={{ color: '#16a34a' }} />
                : <Copy size={14} strokeWidth={1.5} />
              }
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="port-action delete" title="Delete">
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="port-meta">
          <span className="port-status-badge">
            <span className="port-status-dot" />
            Live
          </span>
          <span className={`theme-badge ${portfolio.theme}`}>
            {portfolio.theme === 'dark'
              ? <Moon size={10} strokeWidth={1.5} />
              : <Sun size={10} strokeWidth={1.5} />
            }
            {portfolio.theme === 'dark' ? 'Dark' : 'Light'}
          </span>
          <span className="port-date">
            <Clock size={11} strokeWidth={1.5} />
            {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="port-url">{window.location.origin}{portfolio.public_url}</div>
      </div>
    </>
  );
}

/* ── Dashboard Page ── */
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
    }, 3000);

    try {
      const res = await api.generatePortfolio({ file, theme });
      clearInterval(stepTimer);
      setGenStep(STEPS.length);
      await new Promise(r => setTimeout(r, 400));
      setNewPortfolio(res.data);
      setFile(null);
      await fetchHistory();
    } catch (err) {
      clearInterval(stepTimer);
      setError(err.message || 'Generation failed. Please check your Gemini API key and try again.');
    } finally {
      setGenerating(false);
      setGenStep(-1);
    }
  };

  const handleDelete = async (id) => {
    try { await api.deletePortfolio(id); setPortfolios(prev => prev.filter(p => p.id !== id)); }
    catch { alert('Failed to delete portfolio.'); }
  };

  const handleCopyLink = (url) => { navigator.clipboard.writeText(window.location.origin + url); };

  const isImage = file && ['png', 'jpg', 'jpeg', 'webp'].includes(file.name.split('.').pop().toLowerCase());

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <SEO
        title="Dashboard | PortfolioAI"
        description="Manage your generated portfolios, generate new portfolios from resumes, and monitor your public links."
        noindex={true}
      />

      {/* Navbar */}
      <nav className="dash-nav">
        <Link to="/" className="dash-nav-brand">
          <Zap size={18} style={{ color: '#2563eb' }} />
          <span>PortfolioAI</span>
        </Link>
        <div className="dash-nav-right">
          <div className="dash-user-badge">
            <div className="dash-user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <span>{user?.username}</span>
          </div>
          <button id="dashboard-logout-btn" onClick={handleLogout} className="dash-logout">
            <LogOut size={14} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        {/* Header Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Welcome, {user?.username} 👋
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
              Upload resumes to generate recruiter-ready profile pages instantly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="profile-meta-pill verified">
              <ShieldCheck size={14} style={{ color: '#16a34a' }} /> Free Plan Active
            </span>
          </div>
        </div>

        {/* Quick Stats Row (Dribbble SaaS style) */}
        <div className="dash-stats-row">
          <div className="dash-stat-card">
            <div className="dash-stat-label">Total Portfolios</div>
            <div className="dash-stat-val">{portfolios.length}</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-label">Active Links</div>
            <div className="dash-stat-val" style={{ color: '#16a34a' }}>{portfolios.length} Live</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-label">Generation Speed</div>
            <div className="dash-stat-val" style={{ color: '#2563eb' }}>~30s</div>
          </div>
        </div>

        {/* Generator Card */}
        <div className="gen-card">
          <div className="gen-card-title">
            <Zap size={18} style={{ color: '#2563eb' }} />
            Generate New Portfolio Profile
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{error}</span>
              <button onClick={() => setError('')} style={{ color: '#dc2626' }}><X size={14} /></button>
            </div>
          )}

          {/* Success Banner */}
          {newPortfolio && (
            <div style={{ padding: '16px 18px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#15803d', fontSize: 14, marginBottom: 8 }}>
                <CheckCircle size={16} /> Portfolio Generated Successfully!
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, padding: '7px 12px', borderRadius: 6, background: '#ffffff', border: '1px solid #e2e8f0', color: '#2563eb', fontSize: 12, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {window.location.origin}{newPortfolio.public_url}
                </div>
                <button className="btn-secondary" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => handleCopyLink(newPortfolio.public_url)}>
                  <Copy size={13} /> Copy Link
                </button>
                <Link to={newPortfolio.public_url} target="_blank" className="btn-primary" style={{ padding: '7px 12px', fontSize: 13 }}>
                  <ExternalLink size={13} /> Preview Page
                </Link>
              </div>
            </div>
          )}

          <div className="gen-grid">
            {/* Drop Zone */}
            <div>
              <p className="drop-label">Resume Document</p>
              <div
                id="file-drop-zone"
                className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} id="resume-file-input" type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" style={{ display: 'none' }} onChange={onFileChange} />
                {file ? (
                  <>
                    <FileText size={28} style={{ color: '#2563eb' }} />
                    <p className="drop-file-name" style={{ marginTop: 6 }}>{file.name}</p>
                    <p className="drop-file-size">{(file.size / 1024).toFixed(0)} KB</p>
                    <button className="drop-remove" onClick={e => { e.stopPropagation(); setFile(null); }}>✕ Remove</button>
                  </>
                ) : (
                  <>
                    <div className="drop-upload-icon">
                      <Upload size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <p className="drop-main">Click to browse or drop resume</p>
                    <p className="drop-sub">PDF, DOCX, TXT (Max 16 MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Theme & Actions */}
            <div>
              <p className="drop-label">Visual Template</p>
              <div className="theme-seg" style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={14} /> Light B2B Profile
                </button>
                <button
                  type="button"
                  className={`theme-seg-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={14} /> Dark Developer
                </button>
              </div>

              {generating && (
                <div className="progress-steps" style={{ marginBottom: 14 }}>
                  {STEPS.map((s, i) => (
                    <div key={i} className={`progress-step ${i === genStep ? 'active' : i < genStep ? 'done' : ''}`}>
                      <div className="progress-step-icon">
                        {i < genStep ? <Check size={12} strokeWidth={3} /> : i === genStep ? <div className="progress-step-spinner" /> : i + 1}
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
                className="btn-primary"
                style={{ width: '100%', padding: '11px', fontSize: 14 }}
              >
                {generating ? <><Loader2 size={15} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing Resume…</> : <><Zap size={15} /> Extract & Generate Portfolio</>}
              </button>
            </div>
          </div>
        </div>

        {/* History / Portfolio List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={17} style={{ color: '#2563eb' }} />
              Generated Public Portfolios
              {portfolios.length > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>({portfolios.length})</span>}
            </div>
          </div>

          {historyLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner" style={{ width: 24, height: 24 }} />
            </div>
          ) : historyError ? (
            <p style={{ textAlign: 'center', color: '#dc2626', padding: '30px 0', fontSize: 14 }}>{historyError}</p>
          ) : portfolios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><LayoutDashboard size={22} style={{ color: '#64748b' }} /></div>
              <p>No portfolios generated yet</p>
              <p>Upload a resume above to create your first portfolio link.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {portfolios.map(p => (
                <PortfolioCard key={p.id} portfolio={p} onDelete={handleDelete} onCopyLink={handleCopyLink} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
