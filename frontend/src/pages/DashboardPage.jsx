import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload, HardDrive, Monitor, Zap, Moon, Sun, Copy, ExternalLink,
  CheckCircle, AlertCircle, Loader2, X, Check, Lock, Palette, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/client';
import SEO from '../components/SEO';
import PricingModal from '../components/PricingModal';
import DashboardNavbar from '../components/DashboardNavbar';
import GoogleDriveModal from '../components/GoogleDriveModal';
import PersonalInfoView from './dashboard/PersonalInfoView';
import ActiveLinksView from './dashboard/ActiveLinksView';
import AboutUsView from './dashboard/AboutUsView';
import FeaturesView from './dashboard/FeaturesView';
import { TEMPLATE_REGISTRY, canAccessTemplate } from '../templates';

const ACCEPTED = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

const STEPS = [
  'Parsing document structure & typography…',
  'Extracting skills, projects & experience…',
  'Styling live responsive portfolio…',
];

export default function DashboardPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active navigation tab: 'upload' (default) | 'personal-info' | 'active-links' | 'about-us' | 'features'
  const initialTab = searchParams.get('tab') || 'upload';
  const [activeTab, setActiveTab] = useState(initialTab);

  const userTier = profile?.plan_tier || 'free';

  // Generator states
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [error, setError] = useState('');
  const [newPortfolio, setNewPortfolio] = useState(null);

  // Active links / history
  const [portfolios, setPortfolios] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  // Modals
  const [pricingOpen, setPricingOpen] = useState(false);
  const [targetTierForUpgrade, setTargetTierForUpgrade] = useState('pro');
  const [autoTriggerCheckout, setAutoTriggerCheckout] = useState(false);
  const [googleDriveOpen, setGoogleDriveOpen] = useState(false);
  const autoCheckoutTriggeredRef = useRef(false);

  const fileInputRef = useRef(null);

  // Synchronize active tab with URL query parameter
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'upload') {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab: tabId }, { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) validateAndSetFile(f);
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED.includes(ext) && !f.driveUrl) {
      setError(`Unsupported file ".${ext}". Supported: ${ACCEPTED.join(', ')}`);
      return;
    }
    if (f.size > 16 * 1024 * 1024) {
      setError('File too large. Max allowed size is 16 MB.');
      return;
    }
    setError('');
    setFile(f);
    setNewPortfolio(null);
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
    if (!file) {
      setError('Please select a resume file first (From PC or Google Drive).');
      return;
    }
    setGenerating(true);
    setError('');
    setNewPortfolio(null);
    setGenStep(0);

    const stepTimer = setInterval(() => {
      setGenStep((prev) => {
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
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      if (newPortfolio?.id === id) setNewPortfolio(null);
    } catch (err) {
      alert(err.message || 'Failed to delete portfolio.');
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
  };

  return (
    <div className="dash-shell">
      <SEO
        title="Dashboard | auoraa"
        description="Generate, manage, and customize your live portfolio links across 10 modular templates."
        noindex={true}
      />

      {/* Top Navigation Bar matching user sketch */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        profile={profile}
        onOpenPricing={() => {
          setTargetTierForUpgrade('pro');
          setPricingOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Workspace Container */}
      <main className="sketch-dash-main">
        {/* VIEW 1: Main Generator Workspace (Default Sketch Layout) */}
        {activeTab === 'upload' && (
          <div className="sketch-workspace-container">
            
            {/* ── 1. UPLOAD CARD (Top Section as in Sketch) ── */}
            <section className="sketch-upload-card" aria-label="Upload Resume">
              <div className="sketch-upload-header">
                <h2 className="sketch-upload-title">Upload</h2>
                <p className="sketch-upload-subtitle">
                  Select your resume from PC or Google Drive to generate your instant portfolio.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="err-banner" style={{ marginBottom: 16 }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                  <button type="button" onClick={() => setError('')} aria-label="Close error">
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Success Result Banner */}
              {newPortfolio && (
                <div className="sketch-success-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#15803d', fontSize: 13, marginBottom: 8 }}>
                    <CheckCircle size={16} /> Portfolio Generated Successfully!
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div className="sketch-success-link">
                      {window.location.origin}{newPortfolio.public_url}
                    </div>
                    <button
                      className="button-secondary"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => handleCopyLink(newPortfolio.public_url)}
                      type="button"
                    >
                      <Copy size={12} /> Copy
                    </button>
                    <Link
                      to={newPortfolio.public_url}
                      target="_blank"
                      className="button-primary"
                      style={{ padding: '6px 14px', fontSize: 12 }}
                    >
                      <ExternalLink size={12} /> View Live
                    </Link>
                  </div>
                </div>
              )}

              {/* Upload Source Buttons Row: [From Pc] [Google drive] */}
              <input
                ref={fileInputRef}
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />

              <div className="sketch-source-buttons-row">
                <button
                  type="button"
                  id="upload-from-pc-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="sketch-source-btn"
                >
                  <Monitor size={18} />
                  <span>From Pc</span>
                </button>

                <button
                  type="button"
                  id="upload-from-gdrive-btn"
                  onClick={() => setGoogleDriveOpen(true)}
                  className="sketch-source-btn gdrive"
                >
                  <HardDrive size={18} />
                  <span>Google drive</span>
                </button>
              </div>

              {/* Drag & Drop Zone or Selected File Preview */}
              <div
                id="sketch-file-drop-zone"
                className={`sketch-drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="sketch-file-selected-box">
                    <FileText size={28} style={{ color: 'var(--color-ink)' }} />
                    <div>
                      <div className="sketch-selected-filename">{file.name}</div>
                      <div className="sketch-selected-filesize">
                        {file.driveUrl ? 'Google Drive Linked File' : `${(file.size / 1024).toFixed(0)} KB`}
                      </div>
                    </div>
                    <button
                      className="sketch-remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      type="button"
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="sketch-drop-placeholder">
                    <Upload size={20} style={{ color: 'var(--color-mute)', marginBottom: 6 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                      Drag and drop your resume file here
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-mute)' }}>
                      PDF, DOCX, TXT, PNG, JPG (Up to 16 MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Base Theme Selector: [ Dark | Light ] */}
              <div className="sketch-theme-section">
                <span className="sketch-theme-label">Theme Mode:</span>
                <div className="sketch-theme-toggle">
                  <button
                    type="button"
                    className={`sketch-theme-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon size={14} /> Dark
                  </button>
                  <button
                    type="button"
                    className={`sketch-theme-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun size={14} /> Light
                  </button>
                </div>
              </div>

              {/* Progress Stepper during generation */}
              {generating && (
                <div className="progress-steps" style={{ marginTop: 16, marginBottom: 14 }}>
                  {STEPS.map((s, i) => (
                    <div key={i} className={`progress-step ${i === genStep ? 'active' : i < genStep ? 'done' : ''}`}>
                      <div className="progress-step-icon">
                        {i < genStep ? (
                          <Check size={11} strokeWidth={3} />
                        ) : i === genStep ? (
                          <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Extract & Generate Portfolio CTA */}
              <button
                id="sketch-generate-btn"
                onClick={handleGenerate}
                disabled={generating || !file}
                className="sketch-generate-cta-btn"
                type="button"
              >
                {generating ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} />
                    <span>Extracting & Generating Portfolio…</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Extract & Generate Portfolio</span>
                  </>
                )}
              </button>
            </section>

            {/* ── 2. TEMPLATES GRID (Template 1 to Template 10 as in Sketch) ── */}
            <section className="sketch-templates-section" aria-label="Template Selection">
              <div className="sketch-templates-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Palette size={18} style={{ color: 'var(--color-ink)' }} />
                  <h3 className="sketch-templates-title">Choose Template (10 Available)</h3>
                </div>
                <div className="sketch-current-template-tag">
                  Selected: <strong>{TEMPLATE_REGISTRY[selectedTemplate]?.name}</strong>
                </div>
              </div>

              {/* 10-Grid Boxes */}
              <div className="sketch-templates-grid">
                {Object.entries(TEMPLATE_REGISTRY).map(([tKey, tMeta], index) => {
                  const isAccessible = canAccessTemplate(userTier, tMeta.tier);
                  const isSelected = selectedTemplate === tKey;
                  const templateNumber = index + 1;

                  return (
                    <div
                      key={tKey}
                      onClick={() => handleSelectTemplate(tKey, tMeta)}
                      className={`sketch-template-card ${isSelected ? 'selected' : ''} ${!isAccessible ? 'locked' : ''}`}
                      title={`${tMeta.name} (${tMeta.tier.toUpperCase()})`}
                    >
                      {/* Top info */}
                      <div className="sketch-template-card-top">
                        <span className="sketch-template-num">Template {templateNumber}</span>
                        <span
                          className={`sketch-tier-pill ${tMeta.tier}`}
                        >
                          {tMeta.tier}
                        </span>
                      </div>

                      {/* Template Name & Visual preview bar */}
                      <div className="sketch-template-info">
                        <div className="sketch-template-name">{tMeta.name}</div>
                        <div
                          className="sketch-template-bar"
                          style={{
                            backgroundColor: tMeta.thumbnailColor,
                            boxShadow: isSelected ? `0 0 10px ${tMeta.thumbnailColor}66` : 'none'
                          }}
                        />
                      </div>

                      {/* Status indicator */}
                      <div className="sketch-template-card-bottom">
                        {isSelected ? (
                          <span className="sketch-selected-label">
                            <Check size={12} strokeWidth={3} /> Selected
                          </span>
                        ) : !isAccessible ? (
                          <span className="sketch-locked-label">
                            <Lock size={12} /> Requires {tMeta.tier.toUpperCase()}
                          </span>
                        ) : (
                          <span className="sketch-select-prompt">Click to select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: Personal Info Sub-page */}
        {activeTab === 'personal-info' && (
          <PersonalInfoView
            user={user}
            profile={profile}
            portfoliosCount={portfolios.length}
            onOpenPricing={() => {
              setTargetTierForUpgrade('pro');
              setPricingOpen(true);
            }}
            onNavigateHome={() => handleTabChange('upload')}
          />
        )}

        {/* VIEW 3: Active Links Sub-page */}
        {activeTab === 'active-links' && (
          <ActiveLinksView
            portfolios={portfolios}
            loading={historyLoading}
            error={historyError}
            onDelete={handleDelete}
            onCopyLink={handleCopyLink}
            onNavigateHome={() => handleTabChange('upload')}
          />
        )}

        {/* VIEW 4: About Us Sub-page */}
        {activeTab === 'about-us' && (
          <AboutUsView
            onNavigateHome={() => handleTabChange('upload')}
            onOpenPricing={() => {
              setTargetTierForUpgrade('pro');
              setPricingOpen(true);
            }}
          />
        )}

        {/* VIEW 5: Features Sub-page */}
        {activeTab === 'features' && (
          <FeaturesView
            userTier={userTier}
            onSelectTemplate={(tKey) => setSelectedTemplate(tKey)}
            onOpenPricing={() => {
              setTargetTierForUpgrade('pro');
              setPricingOpen(true);
            }}
            onNavigateHome={() => handleTabChange('upload')}
          />
        )}
      </main>

      {/* ── Google Drive Import Modal ── */}
      <GoogleDriveModal
        isOpen={googleDriveOpen}
        onClose={() => setGoogleDriveOpen(false)}
        onFileSelect={(importedFile) => {
          validateAndSetFile(importedFile);
        }}
      />

      {/* ── Razorpay Pricing & Upgrade Modal ── */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => {
          setPricingOpen(false);
          setAutoTriggerCheckout(false);
          setSearchParams(activeTab === 'upload' ? {} : { tab: activeTab }, { replace: true });
        }}
        initialTier={targetTierForUpgrade}
        autoTrigger={autoTriggerCheckout}
      />
    </div>
  );
}
