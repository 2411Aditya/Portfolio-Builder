import React, { useState, useEffect, useMemo } from 'react';
import {
  X, ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone,
  Moon, Sun, Check, Sparkles, Lock
} from 'lucide-react';
import {
  TEMPLATE_REGISTRY,
  getTemplateComponent,
  canAccessTemplate,
  SAMPLE_PORTFOLIO_DATA
} from '../templates';

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  initialTemplateKey = 'minimal',
  userTier = 'free',
  onSelectTemplate,
  onOpenPricing,
  defaultTheme = 'light',
}) {
  const templateKeys = useMemo(() => Object.keys(TEMPLATE_REGISTRY), []);
  const [currentKey, setCurrentKey] = useState(initialTemplateKey);
  const [previewTheme, setPreviewTheme] = useState(defaultTheme);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // Update selected template when modal opens with new initialTemplateKey
  useEffect(() => {
    if (isOpen && initialTemplateKey && TEMPLATE_REGISTRY[initialTemplateKey]) {
      setCurrentKey(initialTemplateKey);
      setPreviewTheme(defaultTheme || 'light');
      setViewport('desktop');
    }
  }, [isOpen, initialTemplateKey, defaultTheme]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTemplate = TEMPLATE_REGISTRY[currentKey] || TEMPLATE_REGISTRY.minimal;
  const TemplateComponent = getTemplateComponent(currentKey);
  const isAccessible = canAccessTemplate(userTier, currentTemplate.tier);
  const currentIndex = templateKeys.indexOf(currentKey);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + templateKeys.length) % templateKeys.length;
    setCurrentKey(templateKeys[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % templateKeys.length;
    setCurrentKey(templateKeys[nextIdx]);
  };

  const handleUseTemplate = () => {
    if (isAccessible) {
      if (onSelectTemplate) onSelectTemplate(currentKey);
      onClose();
    } else {
      if (onOpenPricing) onOpenPricing(currentTemplate.tier);
    }
  };

  // Prevent mock links from navigating away during live template preview
  const handlePreviewClickCapture = (e) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="template-preview-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="template-preview-container" onClick={(e) => e.stopPropagation()}>
        
        {/* ── Top Control Bar ── */}
        <header className="template-preview-navbar">
          {/* Row 1: Left Switcher + Close */}
          <div className="template-preview-nav-primary">
            {/* Template Selector with Arrow controls */}
            <div className="template-preview-nav-left">
              <div className="template-preview-arrows">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="template-preview-arrow-btn"
                  title="Previous Template"
                  aria-label="Previous Template"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="template-preview-arrow-btn"
                  title="Next Template"
                  aria-label="Next Template"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="template-preview-select-wrap">
                <select
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                  className="template-preview-dropdown"
                  aria-label="Select template to preview"
                >
                  {templateKeys.map((k, idx) => {
                    const meta = TEMPLATE_REGISTRY[k];
                    return (
                      <option key={k} value={k}>
                        #{idx + 1} {meta.name} ({meta.tier.toUpperCase()})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="template-preview-badge-group">
                <span className={`sketch-tier-pill ${currentTemplate.tier}`}>
                  {currentTemplate.tier}
                </span>
                <span className="template-preview-counter hide-on-tiny">
                  {currentIndex + 1}/{templateKeys.length}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="template-preview-close-btn show-on-mobile"
              title="Close Preview"
              aria-label="Close Preview"
            >
              <X size={18} />
            </button>
          </div>

          {/* Row 2 / Center & Right controls */}
          <div className="template-preview-nav-secondary">
            {/* Viewport switcher (Desktop only / hidden on small mobile) */}
            <div className="template-preview-toggle-group hide-on-mobile-screen">
              <button
                type="button"
                className={`template-preview-toggle-btn ${viewport === 'desktop' ? 'active' : ''}`}
                onClick={() => setViewport('desktop')}
                title="Desktop View (Full Width)"
              >
                <Monitor size={14} />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                className={`template-preview-toggle-btn ${viewport === 'tablet' ? 'active' : ''}`}
                onClick={() => setViewport('tablet')}
                title="Tablet View (768px with interactive scroll)"
              >
                <Tablet size={14} />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                className={`template-preview-toggle-btn ${viewport === 'mobile' ? 'active' : ''}`}
                onClick={() => setViewport('mobile')}
                title="Mobile View (390px with interactive scroll)"
              >
                <Smartphone size={14} />
                <span>Mobile</span>
              </button>
            </div>

            {/* Theme switcher */}
            <div className="template-preview-toggle-group">
              <button
                type="button"
                className={`template-preview-toggle-btn ${previewTheme === 'dark' ? 'active' : ''}`}
                onClick={() => setPreviewTheme('dark')}
                title="Preview in Dark Mode"
              >
                <Moon size={13} />
                <span>Dark</span>
              </button>
              <button
                type="button"
                className={`template-preview-toggle-btn ${previewTheme === 'light' ? 'active' : ''}`}
                onClick={() => setPreviewTheme('light')}
                title="Preview in Light Mode"
              >
                <Sun size={13} />
                <span>Light</span>
              </button>
            </div>

            {/* Action CTA & Desktop Close Button */}
            <div className="template-preview-nav-right">
              {isAccessible && (
                <button
                  type="button"
                  onClick={handleUseTemplate}
                  className="template-preview-use-btn"
                  title="Select this template for your portfolio"
                >
                  <Check size={14} strokeWidth={3} />
                  <span>Use Template</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="template-preview-close-btn hide-on-mobile"
                title="Close Preview (Esc)"
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ── Subtitle / Banner notification when viewing locked tier ── */}
        {!isAccessible && (
          <div className="template-preview-tier-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} style={{ flexShrink: 0 }} />
              <span>
                Previewing <strong>{currentTemplate.name}</strong> ({currentTemplate.tier.toUpperCase()} Tier).
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenPricing && onOpenPricing(currentTemplate.tier)}
              className="template-preview-banner-cta"
            >
              Upgrade Plan →
            </button>
          </div>
        )}

        {/* ── Main Preview Viewport ── */}
        <main
          className={`template-preview-viewport-frame viewport-${viewport}`}
          onClickCapture={handlePreviewClickCapture}
        >
          {viewport === 'desktop' ? (
            <div className="template-preview-scroll-viewport desktop-mode">
              <TemplateComponent
                data={SAMPLE_PORTFOLIO_DATA}
                theme={previewTheme}
                customStyles={{}}
                meta={{
                  title: `${currentTemplate.name} - Sample Preview`,
                  owner: 'Alex Rivera'
                }}
              />
            </div>
          ) : (
            <div className="template-preview-device-outer">
              <div className={`template-preview-device-shell device-${viewport}`}>
                <div className="template-preview-device-topbar">
                  <div className="template-preview-device-earpiece" />
                  <div className="template-preview-device-camera" />
                </div>
                <div className="template-preview-device-screen">
                  <TemplateComponent
                    data={SAMPLE_PORTFOLIO_DATA}
                    theme={previewTheme}
                    customStyles={{}}
                    meta={{
                      title: `${currentTemplate.name} - Sample Preview`,
                      owner: 'Alex Rivera'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
