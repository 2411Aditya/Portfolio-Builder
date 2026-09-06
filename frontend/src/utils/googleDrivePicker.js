/**
 * Google Drive Picker API Integration
 * Loads Google Picker & Google Identity Services (GIS) for direct Drive file selection
 */

let gapiInited = false;
let gisInited = false;
let tokenClient = null;

const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';

/**
 * Load a script dynamically if not already present
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * Initialize Google API and GIS client
 */
export async function initGoogleDrivePicker() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!clientId || !apiKey) {
    return { available: false, error: 'Google Client ID is not configured' };
  }

  try {
    // 1. Load GAPI (Google API)
    await loadScript('https://apis.google.com/js/api.js');
    await new Promise((resolve) => {
      window.gapi.load('picker', { callback: resolve });
    });
    gapiInited = true;

    // 2. Load GIS (Google Identity Services)
    await loadScript('https://accounts.google.com/gsi/client');
    gisInited = true;

    return { available: true };
  } catch (err) {
    console.warn('Google Drive Picker init notice:', err);
    return { available: false, error: err.message };
  }
}

/**
 * Open Google Drive Picker modal popup
 */
export function openGoogleDrivePicker({ onSelect, onCancel, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!clientId) {
    if (onError) onError(new Error('VITE_GOOGLE_CLIENT_ID is not configured in .env'));
    return;
  }

  // Request OAuth Access Token
  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: async (response) => {
        if (response.error !== undefined) {
          if (onError) onError(response);
          return;
        }
        createPicker(response.access_token, apiKey, onSelect, onCancel, onError);
      },
    });

    tokenClient.requestAccessToken({ prompt: '' });
  } catch (err) {
    if (onError) onError(err);
  }
}

/**
 * Render the Google Picker dialog
 */
function createPicker(accessToken, apiKey, onSelect, onCancel, onError) {
  try {
    const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
    view.setMimeTypes('application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/vnd.google-apps.document');

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(import.meta.env.VITE_GOOGLE_APP_ID || '')
      .setOAuthToken(accessToken)
      .addView(view)
      .addView(new window.google.picker.DocsView())
      .setDeveloperKey(apiKey)
      .setCallback(async (data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const doc = data[window.google.picker.Response.DOCUMENTS][0];
          const fileId = doc[window.google.picker.Document.ID];
          const fileName = doc[window.google.picker.Document.NAME];
          const mimeType = doc[window.google.picker.Document.MIME_TYPE];

          try {
            const fileBlob = await fetchDriveFileBlob(fileId, mimeType, accessToken);
            const selectedFile = new File([fileBlob], fileName, { type: fileBlob.type || 'application/pdf' });
            selectedFile.driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
            if (onSelect) onSelect(selectedFile);
          } catch (err) {
            if (onError) onError(err);
          }
        } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
          if (onCancel) onCancel();
        }
      })
      .build();

    picker.setVisible(true);
  } catch (err) {
    if (onError) onError(err);
  }
}

/**
 * Download file blob from Google Drive API
 */
async function fetchDriveFileBlob(fileId, mimeType, accessToken) {
  let downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  
  // If it's a native Google Doc, export it as PDF
  if (mimeType === 'application/vnd.google-apps.document') {
    downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
  }

  const res = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file from Google Drive (Status: ${res.status})`);
  }

  return await res.blob();
}
