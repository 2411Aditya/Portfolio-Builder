import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, Zap, Moon, Sun, Copy, ExternalLink, Trash2, FileText,
  Image, CheckCircle, AlertCircle, LogOut, Clock, Loader2, X, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/client';

const ACCEPTED = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

function PortfolioCard({ portfolio, onDelete, onCopyLink }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this portfolio? The link will stop working.')) return;
    setDeleting(true);
    await onDelete(portfolio.id);
    setDeleting(false);
  };

  const handleCopy = () => {
    onCopyLink(portfolio.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="port-card">
      <div className="port-card-top">
        <div className="port-card-title">{portfolio.title}</div>
        <div className="port-card-actions">
          <Link to={portfolio.public_url} target="_blank" className="port-action preview" title="Preview">
            <ExternalLink size={16} />
          </Link>
          <button onClick={handleCopy} className="port-action copy" title="Copy link">
            {copied ? <CheckCircle size={16} style={{ color: '#4ade80' }} /> : <Copy size={16} />}
          </button>
          <button onClick={handleDelete} disabled={deleting} className="port-action delete" title="Delete">
            {deleting ? <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
      <div className="port-meta">
        <span className="port-date">
          <Clock size={12} />
          {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className={`theme-badge ${portfolio.theme}`}>
          {portfolio.theme === 'dark' ? <Moon size={11} /> : <Sun size={11} />}
          {portfolio.theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </div>
      <div className="port-url">{window.location.origin}{portfolio.public_url}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
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
    setGenerating(true); setError(''); setNewPortfolio(null);
    try {
      const res = await api.generatePortfolio({ file, theme });
      setNewPortfolio(res.data);
      setFile(null);
      await fetchHistory();
    } catch (err) {
      setError(err.message || 'Generation failed. Please check your Gemini API key and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    try { await api.deletePortfolio(id); setPortfolios(prev => prev.filter(p => p.id !== id)); }
    catch { alert('Failed to delete portfolio.'); }
  };

  const handleCopyLink = (url) => { navigator.clipboard.writeText(window.location.origin + url); };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* Navbar */}
      <nav className="dash-nav">
        <div className="dash-nav-brand">
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(99,102,241,0.25)' }}>
            <Zap size={16} color="#fff" />
          </div>
          <span className="grad">PortfolioAI</span>
        </div>
        <div className="dash-nav-right">
          <div className="dash-user-badge">
            <div className="dash-user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <span>{user?.username}</span>
          </div>
          <button id="dashboard-logout-btn" onClick={handleLogout} className="dash-logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        {/* Greeting */}
        <div className="dash-greeting fade-up">
          <h1>Hello, <span className="grad">{user?.username}</span> 👋</h1>
          <p>Upload a resume and generate your AI-powered portfolio in seconds.</p>
        </div>

        {/* Generator card */}
        <div className="gen-card">
          <div className="gen-card-title">
            <Zap size={20} color="#6366f1" />
            Generate New Portfolio
          </div>

          {/* Error */}
          {error && (
            <div className="err-banner" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
              <button onClick={() => setError('')}><X size={15} /></button>
            </div>
          )}

          {/* Success */}
          {newPortfolio && (
            <div className="success-banner">
              <div className="success-banner-title">
                <CheckCircle size={18} /> Portfolio Generated Successfully!
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Your portfolio is live at:</p>
              <div className="success-url-row">
                <div className="success-url">{window.location.origin}{newPortfolio.public_url}</div>
                <button id="result-copy-link-btn" className="success-action action-copy" onClick={() => handleCopyLink(newPortfolio.public_url)}>
                  <Copy size={14} /> Copy
                </button>
                <Link to={newPortfolio.public_url} target="_blank" id="result-preview-btn" className="success-action action-preview" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={14} /> Preview
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
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} id="resume-file-input" type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" style={{ display: 'none' }} onChange={onFileChange} />
                {file ? (
                  <>
                    {['png','jpg','jpeg','webp'].includes(file.name.split('.').pop().toLowerCase())
                      ? <Image size={28} color="#0284c7" />
                      : <FileText size={28} color="#6366f1" />
                    }
                    <p className="drop-file-name">{file.name}</p>
                    <p className="drop-file-size">{(file.size / 1024).toFixed(0)} KB</p>
                    <button className="drop-remove" onClick={e => { e.stopPropagation(); setFile(null); }}>Remove</button>
                  </>
                ) : (
                  <>
                    <Upload size={32} color={dragging ? '#6366f1' : '#94a3b8'} />
                    <p className="drop-main">Drag & drop your resume</p>
                    <p className="drop-sub">or click to browse</p>
                    <p className="drop-types">PDF • DOCX • TXT • PNG • JPG • WebP — max 16 MB</p>
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
                    <div className={`theme-preview ${t.prevClass}`} style={{ fontSize: 22 }}>{t.emoji}</div>
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

              <button
                id="generate-portfolio-btn"
                onClick={handleGenerate}
                disabled={generating || !file}
                className="btn-grad"
                style={{ width: '100%', marginTop: 4 }}
              >
                {generating
                  ? <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> AI Scanning Resume…</>
                  : <><Zap size={18} /> Scan Resume & Generate Link</>
                }
              </button>
              {generating && <p className="processing-hint">This may take 10–30 seconds while AI parses your resume…</p>}
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <div className="history-header">
            <Globe size={20} color="#6366f1" />
            My Portfolios
            {portfolios.length > 0 && <span className="history-count">({portfolios.length})</span>}
          </div>

          {historyLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <div className="spinner" />
            </div>
          ) : historyError ? (
            <p style={{ textAlign: 'center', color: '#dc2626', padding: '40px 0', fontSize: 14 }}>{historyError}</p>
          ) : portfolios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FileText size={28} color="#94a3b8" /></div>
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
