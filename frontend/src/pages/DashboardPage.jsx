import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, Zap, Moon, Sun, Copy, ExternalLink, Trash2, FileText,
  Image, CheckCircle, AlertCircle, LogOut, Clock, Loader2, X,
  Globe, Check, LayoutDashboard, Plus
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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">
          <Trash2 size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
        </div>
        <div className="modal-title">Delete Portfolio</div>
        <div className="modal-body">
          Are you sure you want to delete <strong style={{ color: 'var(--fg)' }}>"{portfolioTitle}"</strong>? The public link will stop working immediately. This action cannot be undone.
        </div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-delete" onClick={onConfirm} disabled={deleting}>
            {deleting ? <><Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> Deleting…</> : 'Delete Portfolio'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio Card ── */
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
                ? <Check size={14} strokeWidth={2.5} style={{ color: '#4ade80' }} />
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
  const [theme, setTheme] = useState('dark');
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
      setPortfolios(res.data.portfolios);
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

    // Animate through steps while actual generation runs
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
      setGenStep(STEPS.length); // all done
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#09090b' }}>
      <SEO
        title="Dashboard | PortfolioAI"
        description="Manage your generated portfolios, generate new portfolios from resumes, and monitor your public links."
        noindex={true}
      />

      {/* Navbar */}
      <nav className="dash-nav">
        <Link to="/" className="dash-nav-brand">
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} strokeWidth={2} color="#fff" />
          </div>
          PortfolioAI
        </Link>
        <div className="dash-nav-right">
          <div className="dash-user-badge">
            <div className="dash-user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <span>{user?.username}</span>
          </div>
          <button id="dashboard-logout-btn" onClick={handleLogout} className="dash-logout">
            <LogOut size={14} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        {/* Greeting */}
        <div className="dash-greeting fade-up">
          <h1>Hello, <span className="grad">{user?.username}</span> 👋</h1>
          <p>Upload a resume and generate your AI-powered portfolio in seconds.</p>
        </div>

        {/* Generator Card */}
        <div className="gen-card">
          <div className="gen-card-title">
            <Zap size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            Generate New Portfolio
          </div>

          {/* Error */}
          {error && (
            <div className="err-banner" style={{ marginBottom: 20 }}>
              <AlertCircle size={15} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
              <button onClick={() => setError('')}><X size={14} strokeWidth={2} /></button>
            </div>
          )}

          {/* Success */}
          {newPortfolio && (
            <div className="success-banner">
              <div className="success-banner-title">
                <CheckCircle size={16} strokeWidth={1.5} /> Portfolio Generated Successfully!
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 12 }}>Your portfolio is live at:</p>
              <div className="success-url-row">
                <div className="success-url">{window.location.origin}{newPortfolio.public_url}</div>
                <button id="result-copy-link-btn" className="success-action action-copy" onClick={() => handleCopyLink(newPortfolio.public_url)}>
                  <Copy size={13} strokeWidth={1.5} /> Copy
                </button>
                <Link to={newPortfolio.public_url} target="_blank" id="result-preview-btn" className="success-action action-preview" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={13} strokeWidth={1.5} /> Preview
                </Link>
              </div>
            </div>
          )}

          <div className="gen-grid">
            {/* Drop zone */}
            <div>
              <p className="drop-label">Resume File</p>
              <div
                id="file-drop-zone"
                className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                style={{ cursor: file ? 'default' : 'pointer' }}
              >
                <input ref={fileInputRef} id="resume-file-input" type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" style={{ display: 'none' }} onChange={onFileChange} />
                {file ? (
                  <>
                    {isImage
                      ? <Image size={28} strokeWidth={1.5} style={{ color: '#4ade80' }} />
                      : <FileText size={28} strokeWidth={1.5} style={{ color: '#818cf8' }} />
                    }
                    <p className="drop-file-name">{file.name}</p>
                    <p className="drop-file-size">{(file.size / 1024).toFixed(0)} KB</p>
                    <button className="drop-remove" onClick={e => { e.stopPropagation(); setFile(null); }}>✕ Remove</button>
                  </>
                ) : (
                  <>
                    <div className="drop-upload-icon">
                      <Upload size={20} strokeWidth={1.5} style={{ color: dragging ? '#818cf8' : 'rgba(255,255,255,0.3)' }} />
                    </div>
                    <p className="drop-main">Drop your resume here</p>
                    <p className="drop-sub">or click to browse</p>
                    <p className="drop-types">PDF • DOCX • TXT • Images — max 16 MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Theme + Generate */}
            <div>
              <p className="drop-label">Portfolio Theme</p>
              <div className="theme-options">
                {[
                  { value: 'dark', label: 'Dark Mode', desc: 'Sleek dark with glowing accents', emoji: '🌙', prevClass: 'dark-prev' },
                  { value: 'light', label: 'Light Mode', desc: 'Clean white with vibrant colors', emoji: '☀️', prevClass: 'light-prev' },
                ].map(t => (
                  <label
                    key={t.value}
                    htmlFor={`theme-${t.value}`}
                    className={`theme-option ${theme === t.value ? (t.value === 'dark' ? 'active-dark' : 'active-light') : ''}`}
                  >
                    <input id={`theme-${t.value}`} type="radio" name="theme" value={t.value} checked={theme === t.value} onChange={() => setTheme(t.value)} style={{ display: 'none' }} />
                    <div className={`theme-preview ${t.prevClass}`} style={{ fontSize: 20 }}>{t.emoji}</div>
                    <div className="theme-info">
                      <strong>{t.label}</strong>
                      <span>{t.desc}</span>
                    </div>
                    <div className={`theme-radio ${theme === t.value ? (t.value === 'dark' ? 'dark-active' : 'light-active') : ''}`}>
                      {theme === t.value && <div className="theme-radio-dot" />}
                    </div>
                  </label>
                ))}
              </div>

              {/* 3-step progress during generation */}
              {generating && (
                <div className="progress-steps" style={{ marginBottom: 14 }}>
                  {STEPS.map((s, i) => (
                    <div key={i} className={`progress-step ${i === genStep ? 'active' : i < genStep ? 'done' : ''}`}>
                      <div className="progress-step-icon">
                        {i < genStep
                          ? <Check size={12} strokeWidth={3} />
                          : i === genStep
                          ? <div className="progress-step-spinner" />
                          : i + 1
                        }
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
                className="generate-btn"
              >
                {generating
                  ? <><Loader2 size={16} strokeWidth={1.5} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing…</>
                  : <><Zap size={16} strokeWidth={1.5} /> Scan Resume & Generate Link</>
                }
              </button>
              {generating && <p className="processing-hint">This may take 10–30 seconds while AI parses your resume…</p>}
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <div className="history-header">
            <Globe size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            My Portfolios
            {portfolios.length > 0 && <span className="history-count">({portfolios.length})</span>}
          </div>

          {historyLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
              <div className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : historyError ? (
            <p style={{ textAlign: 'center', color: '#fca5a5', padding: '40px 0', fontSize: 14 }}>{historyError}</p>
          ) : portfolios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><LayoutDashboard size={24} strokeWidth={1.5} style={{ color: 'var(--fg-subtle)' }} /></div>
              <p>No portfolios yet</p>
              <p>Upload a resume above to create your first portfolio.</p>
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
