import React, { useState } from 'react';
import {
  X, Sparkles, Send, Loader2, Lock, CheckCircle2,
  RefreshCw, Palette, MessageSquare, AlertCircle, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { customizePortfolioWithAI } from '../utils/aiCustomizer';

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
  onOpenPricing,
}) {
  const { profile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Design Architect. Ask me to change your theme colors, refine your bio, highlight key skills, or add custom sections.',
    },
  ]);

  if (!isOpen) return null;

  const isPro = profile?.plan_tier === 'pro';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const updatedStyles = await customizePortfolioWithAI({
        portfolioId,
        currentData: portfolioData,
        currentCustomStyles,
        prompt: userMessage,
      });

      onApplyStyles(updatedStyles);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Done! I've updated your layout & theme palette (${updatedStyles.themeOverrides?.primaryColor || 'customized'}). What else would you like to refine?`,
          styles: updatedStyles,
        },
      ]);
    } catch (err) {
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

  const handleSuggestionClick = (sug) => {
    setPrompt(sug);
  };

  const handleResetStyles = () => {
    onApplyStyles({});
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: 'Reset all custom style overrides back to original template defaults.',
      },
    ]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 440,
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
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
          
          {/* Action Bar (Reset / Info) */}
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
            <span style={{ color: '#94a3b8' }}>Live Layout Sync Active</span>
            <button
              type="button"
              onClick={handleResetStyles}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
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
                  maxWidth: '88%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#4f46e5' : msg.isError ? '#7f1d1d' : '#1e293b',
                  fontSize: 13,
                  lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                {msg.text}
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
