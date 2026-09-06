import React, { useState, useEffect } from 'react';
import { HardDrive, X, Link2, AlertCircle, Loader2, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { initGoogleDrivePicker, openGoogleDrivePicker } from '../utils/googleDrivePicker';

export default function GoogleDriveModal({ isOpen, onClose, onFileSelect }) {
  const [driveUrl, setDriveUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickerReady, setPickerReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initGoogleDrivePicker().then((res) => {
        if (res.available) setPickerReady(true);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenDriveDirectly = () => {
    window.open('https://drive.google.com', '_blank', 'noopener,noreferrer');
  };

  const handleLaunchPicker = () => {
    setError('');
    setLoading(true);

    openGoogleDrivePicker({
      onSelect: (selectedFile) => {
        setLoading(false);
        onFileSelect(selectedFile);
        onClose();
      },
      onCancel: () => {
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Could not connect to Google Drive Picker.');
      },
    });
  };

  const handleImportLink = async (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      setError('Please enter a valid Google Drive or Docs link.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let fileId = null;
      const match1 = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const match2 = driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match1) fileId = match1[1];
      else if (match2) fileId = match2[1];

      if (!fileId && !driveUrl.includes('drive.google.com') && !driveUrl.includes('docs.google.com')) {
        throw new Error('Invalid Google Drive URL. Please make sure the link is publicly accessible ("Anyone with the link can view").');
      }

      const fileName = `google_drive_resume_${(fileId || 'document').slice(0, 8)}.pdf`;
      const blob = new Blob([`Google Drive Reference: ${driveUrl}`], { type: 'application/pdf' });
      const driveFile = new File([blob], fileName, { type: 'application/pdf' });
      driveFile.driveUrl = driveUrl;

      onFileSelect(driveFile);
      setDriveUrl('');
      onClose();
    } catch (err) {
      setError(err.message || 'Could not import file from Google Drive link. Please check permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, width: '92%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>Select from Google Drive</h3>
              <p style={{ fontSize: 12, color: 'var(--color-mute)', margin: 0 }}>Open Drive or paste your shareable resume link</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-mute)', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="err-banner" style={{ marginBottom: 14 }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Action 1: Direct Open Google Drive */}
        <div style={{
          background: 'var(--color-bg-subtle, #f8fafc)',
          border: '1px solid var(--color-border, #e2e8f0)',
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>Open Google Drive</div>
            <div style={{ fontSize: 11, color: 'var(--color-mute)' }}>Browse your files directly in Google Drive in a new tab</div>
          </div>
          <button
            type="button"
            onClick={handleOpenDriveDirectly}
            className="button-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '7px 14px',
              background: '#0284c7',
              borderColor: '#0284c7',
              whiteSpace: 'nowrap'
            }}
          >
            <ExternalLink size={13} />
            <span>Go to Drive</span>
          </button>
        </div>

        {/* Quick Action 2: Google Picker (if client id enabled) */}
        {pickerReady && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.06))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>Interactive Google Picker</div>
              <div style={{ fontSize: 11, color: 'var(--color-mute)' }}>Select your resume directly from the Drive popup window</div>
            </div>
            <button
              type="button"
              onClick={handleLaunchPicker}
              disabled={loading}
              className="button-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                padding: '7px 14px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none',
                color: '#fff',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={13} />
              <span>Launch Picker</span>
            </button>
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-mute)', textTransform: 'uppercase' }}>Or paste link</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>

        {/* Paste link form */}
        <form onSubmit={handleImportLink}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>
              Google Drive / Docs Shareable Link
            </label>
            <div style={{ position: 'relative' }}>
              <Link2 size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-mute)' }} />
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 13,
                  color: 'var(--color-ink)',
                  outline: 'none',
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-mute)', marginTop: 6, lineHeight: 1.4 }}>
              Tip: In Drive, right click your resume &gt; <strong>Share</strong> &gt; set access to <strong>"Anyone with the link can view"</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !driveUrl.trim()}
              className="button-primary"
              style={{ fontSize: 13, padding: '8px 18px', background: '#0284c7', borderColor: '#0284c7' }}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> Importing…</> : 'Import & Select'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
