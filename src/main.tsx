import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// ─── Lock orientation to portrait (best-effort) ────────────────
// In a TWA on Android the manifest's "orientation: portrait" is also enforced
// at the OS level after the APK is regenerated. This JS call helps for the
// already-installed APK too. It will silently no-op on browsers that don't
// allow programmatic lock outside fullscreen.
(() => {
  const so = (screen as Screen & { orientation?: ScreenOrientation }).orientation;
  if (so && typeof so.lock === 'function') {
    so.lock('portrait-primary').catch(() => { /* not supported / permission denied — ignore */ });
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
