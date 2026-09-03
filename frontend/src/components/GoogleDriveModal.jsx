import React, { useState } from 'react';
import { HardDrive, X, Link2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function GoogleDriveModal({ isOpen, onClose, onFileSelect }) {
  const [driveUrl, setDriveUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      setError('Please enter a valid Google Drive or Docs link.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Extract File ID from various Google Drive URL formats
      let fileId = null;
      const match1 = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const match2 = driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match1) fileId = match1[1];
      else if (match2) fileId = match2[1];

      if (!fileId && !driveUrl.includes('drive.google.com') && !driveUrl.includes('docs.google.com')) {
        throw new Error('Invalid Google Drive URL. Please make sure the link is publicly accessible ("Anyone with the link can view").');
      }

      // Create a virtual mock File / proxy payload with the link reference
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
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, width: '90%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>Import from Google Drive</h3>
              <p style={{ fontSize: 12, color: 'var(--color-mute)', margin: 0 }}>Paste your shareable Google Drive or Docs link</p>
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

        <form onSubmit={handleImport}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>
              Google Drive Shareable Link
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
                autoFocus
              />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-mute)', marginTop: 6, lineHeight: 1.4 }}>
              Tip: Set access to <strong>"Anyone with the link can view"</strong> so our AI can extract your resume contents.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
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
