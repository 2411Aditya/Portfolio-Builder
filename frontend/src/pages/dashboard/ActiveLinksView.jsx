import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, ExternalLink, Copy, Trash2, Check, Moon, Sun,
  Palette, Clock, Plus, Search, Loader2, AlertCircle, LayoutDashboard
} from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../../templates';

/* ── Delete Confirmation Modal ── */
function DeleteModal({ portfolioTitle, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 9999 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 size={20} strokeWidth={1.5} style={{ color: '#ee1d36' }} />
        </div>
        <div className="eyebrow-uppercase-sm" style={{ color: '#ee1d36', marginBottom: 4 }}>CONFIRM DELETION</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8 }}>Delete Portfolio</div>
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

/* ── Active Link Card ── */
function ActiveLinkCard({ portfolio, onDelete, onCopyLink }) {
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
      <div className="port-card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 10, border: '1px solid var(--color-hairline)' }}>
        <div>
          <div className="port-card-top">
            <div>
              <div className="port-card-title" title={portfolio.title} style={{ fontSize: 16, fontWeight: 700 }}>
                {portfolio.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-mute)', marginTop: 2 }}>
                Generated live website
              </div>
            </div>
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

          <div className="port-meta" style={{ marginTop: 12, marginBottom: 14 }}>
            <span className="port-status-badge">
              <span className="port-status-dot" />
              Live & Active
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
              {portfolio.theme === 'dark' ? 'Dark Mode' : 'Light Canvas'}
            </span>
            <span className="port-date">
              <Clock size={11} strokeWidth={1.5} />
              {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 8 }}>
          <div className="port-url" style={{ margin: 0, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 70px)' }}>
            {window.location.origin}{portfolio.public_url}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? '#15803d' : '#0284c7',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy URL</>}
          </button>
        </div>
      </div>
    </>
  );
}

export default function ActiveLinksView({ portfolios, loading, error, onDelete, onCopyLink, onNavigateHome }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPortfolios = portfolios.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.template_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="eyebrow-uppercase-sm" style={{ color: 'var(--color-brand)', marginBottom: 4 }}>LIVE DEPLOYMENTS</div>
          <h1 className="display-sm" style={{ fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
            Active Links ({portfolios.length})
          </h1>
          <p className="body-sm" style={{ marginTop: 4, color: 'var(--color-mute)' }}>
            All your published, public live portfolio links accessible on the web.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="button-primary"
          style={{ fontSize: 13, padding: '9px 18px' }}
        >
          <Plus size={15} /> Generate New Link
        </button>
      </div>

      {/* Search Bar */}
      {portfolios.length > 0 && (
        <div style={{ marginBottom: 24, position: 'relative', maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-mute)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or template…"
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: 13,
              color: 'var(--color-ink)',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0', flexDirection: 'column', gap: 12 }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
          <span style={{ fontSize: 13, color: 'var(--color-mute)' }}>Loading your active links…</span>
        </div>
      ) : error ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '36px 20px', color: '#ee1d36' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 8px' }} />
          <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: '#f5f5f5', border: '1px solid #d8d8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Globe size={24} style={{ color: 'var(--color-mute)' }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>No active links yet</h3>
          <p className="body-sm" style={{ maxWidth: 420, margin: '0 auto 20px' }}>
            You haven't generated any portfolios yet. Upload your resume to create your first public link in seconds!
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="button-primary"
            style={{ fontSize: 13, padding: '10px 20px' }}
          >
            <Plus size={15} /> Upload & Generate Portfolio
          </button>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 14, color: 'var(--color-mute)', margin: 0 }}>No active links match "{searchTerm}".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredPortfolios.map(p => (
            <ActiveLinkCard
              key={p.id}
              portfolio={p}
              onDelete={onDelete}
              onCopyLink={onCopyLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}
