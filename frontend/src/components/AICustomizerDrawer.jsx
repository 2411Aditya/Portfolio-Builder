import React, { useState } from 'react';
import {
  X, Sparkles, Send, Loader2, Lock, CheckCircle2,
  RefreshCw, Palette, MessageSquare, AlertCircle, Zap,
  Undo2, Copy, Check, Cloud, CloudCheck, CheckCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { customizePortfolioWithAI } from '../utils/aiCustomizer';
import { updatePortfolioStylesAndData } from '../api/client';

const SUGGESTIONS = [
  'Make the theme emerald green and tone my bio for a Senior Cloud Architect',
  'Highlight React, Python, and System Design with a modern cyber aesthetic',
  'Corporate slate palette with an executive leadership summary',
  'Neon violet cyberpunk theme with high-contrast accent glow',
  'Minimalist monochrome styling with focus on open source projects',
];

export default function AICustomizerDrawer({
  isOpen,
  onClose,
  portfolioId,
  portfolioData,
  currentCustomStyles,
  onApplyStyles,
  onApplyStylesAndData,
  onOpenPricing,
}) {
  const { profile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncStatus, setSyncStatus] = useState('saved'); // 'saving' | 'saved' | 'error'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Design Architect. Ask me to change your theme colors, refine your bio, highlight key skills, update your resume content, or add custom sections.',
    },
  ]);

  if (!isOpen) return null;

  const isPro = profile?.plan_tier === 'pro';

  const applyChanges = (styles, data) => {
    if (onApplyStylesAndData) {
      onApplyStylesAndData(styles, data);
    } else if (onApplyStyles) {
      onApplyStyles(styles);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Capture state snapshot before this prompt is executed for reliable Revert/Undo
    const preSnapshot = {
      customStyles: JSON.parse(JSON.stringify(currentCustomStyles || {})),
      portfolioData: JSON.parse(JSON.stringify(portfolioData || {})),
    };

    setPrompt('');
    setError('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage,
        time: nowTime,
        snapshot: preSnapshot,
      },
    ]);

    setLoading(true);
    setSyncStatus('saving');

    try {
      const result = await customizePortfolioWithAI({
        portfolioId,
        currentData: portfolioData,
        currentCustomStyles,
        prompt: userMessage,
      });

      const updatedStyles = result.customStyles;
      const updatedData = result.portfolioData || portfolioData;

      applyChanges(updatedStyles, updatedData);

      if (portfolioId) {
        try {
          await updatePortfolioStylesAndData(portfolioId, updatedStyles, updatedData);
        } catch (e) {
          console.warn('Auto-save error:', e);
        }
      }

      setSyncStatus('saved');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: result.summary || `Done! I've updated and saved your changes. What else would you like to refine?`,
          styles: updatedStyles,
        },
      ]);
    } catch (err) {
      setSyncStatus('error');
      setError(err.message || 'AI Customization failed. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Oops: ${err.message || 'I had trouble processing that request.'}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevertToSnapshot = async (snapshot, promptText) => {
    if (!snapshot || loading) return;

    // 1. Immediately apply rollback to UI
    applyChanges(snapshot.customStyles, snapshot.portfolioData);

    setLoading(true);
    setSyncStatus('saving');
    setError('');

    try {
      if (portfolioId) {
        await updatePortfolioStylesAndData(portfolioId, snapshot.customStyles, snapshot.portfolioData);
      }

      setSyncStatus('saved');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `↩️ Reverted changes back to state before: "${promptText}"`,
        },
      ]);
    } catch (err) {
      console.warn('Revert cloud sync error:', err);
      setSyncStatus('error');
      setError(err.message || 'Failed to revert changes to cloud.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSuggestionClick = (sug) => {
    setPrompt(sug);
  };

  const handleResetStyles = async () => {
    if (loading) return;

    // 1. Immediately apply reset to UI
    applyChanges({}, portfolioData);

    setLoading(true);
    setSyncStatus('saving');

    try {
      if (portfolioId) {
        await updatePortfolioStylesAndData(portfolioId, {}, portfolioData);
      }
      setSyncStatus('saved');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Reset all custom style overrides back to original template defaults and saved to cloud.',
        },
      ]);
    } catch (err) {
      console.warn('Reset cloud sync warning:', err);
      setSyncStatus('error');
      setError(err.message || 'Failed to reset styles in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="ai-customizer-drawer"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#090d16',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              AI Customizer
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: isPro ? '#a855f7' : '#64748b',
                  color: '#fff',
                }}
              >
                {isPro ? 'PRO' : 'LOCKED'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Natural Language Theme & Copy Engine</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
          }}
          aria-label="Close drawer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Non-Pro Tier Locked Overlay */}
      {!isPro ? (
        <div
          style={{
            flex: 1,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Lock size={28} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Pro Feature Locked</h3>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 300 }}>
            Upgrade to <strong>Pro Plan</strong> to customize your portfolio theme, refine your bio, and tailor skills using AI natural language commands.
          </p>
          <button
            type="button"
            className="button-primary"
            onClick={() => {
              onClose();
              if (onOpenPricing) onOpenPricing('pro');
            }}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              border: 'none',
              fontWeight: 700,
            }}
          >
            <Sparkles size={16} /> Upgrade to Pro (₹29/mo)
          </button>
        </div>
      ) : (
        /* Pro Active Chat Interface */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Action Bar (Cloud Sync / Reset) */}
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
              {syncStatus === 'saving' ? (
                <span style={{ color: '#c084fc', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Loader2 size={12} style={{ animation: 'spin 0.6s linear infinite' }} />
                  Saving to Cloud…
                </span>
              ) : syncStatus === 'error' ? (
                <span style={{ color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <AlertCircle size={12} />
                  Cloud Sync Failed
                </span>
              ) : (
                <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Live Cloud Sync Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetStyles}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: loading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                opacity: loading ? 0.6 : 1,
              }}
              title="Reset all styles and resume overrides"
            >
              <RefreshCw size={12} /> Reset Styles
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  padding: msg.role === 'user' ? '12px 14px 8px 16px' : '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#4338ca' : msg.isError ? '#7f1d1d' : '#1e293b',
                  fontSize: 13,
                  lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div>{msg.text}</div>

                {/* User Prompt Controls: Time, Copy, Undo/Revert Button */}
                {msg.role === 'user' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 8,
                      fontSize: 10,
                      color: 'rgba(255, 255, 255, 0.6)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: 4,
                      marginTop: 2,
                    }}
                  >
                    <span>{msg.time || ''}</span>

                    {/* Copy Prompt */}
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(msg.text, i)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.7)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        transition: 'color 0.15s',
                      }}
                      title={copiedIndex === i ? 'Copied!' : 'Copy prompt'}
                    >
                      {copiedIndex === i ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
                    </button>

                    {/* Undo / Revert Button */}
                    {msg.snapshot && (
                      <button
                        type="button"
                        onClick={() => handleRevertToSnapshot(msg.snapshot, msg.text)}
                        disabled={loading}
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: 'none',
                          borderRadius: 4,
                          color: '#ffffff',
                          cursor: loading ? 'default' : 'pointer',
                          padding: '3px 6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          transition: 'background 0.15s',
                        }}
                        title="Undo changes up to this point"
                      >
                        <Undo2 size={12} />
                        <span>Revert</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: '#c084fc',
                }}
              >
                <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} />
                <span>Crafting custom palette & copy refinements…</span>
              </div>
            )}
          </div>

          {/* Suggested Prompts Carousel */}
          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', display: 'flex', gap: 8 }}>
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(sug)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 16,
              background: '#090d16',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Make it emerald green with executive bio..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                background: prompt.trim() && !loading ? '#6366f1' : '#334155',
                border: 'none',
                color: '#fff',
                cursor: prompt.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
