/* ============================================
   CITY AI — Notifications & Alert Toast System
   Real-time sliding toast banners with audio cues
   ============================================ */

import { navigate } from '../router.js';

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'cityai-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      max-width: 420px;
      width: calc(100% - 48px);
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Play a subtle synthesized alert audio cue using Web Audio API
 */
function playAlertBeep(frequency = 880, type = 'sine', duration = 0.15) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Show a sliding Alert Toast notification
 * @param {Object} alert
 * @param {string} alert.title - Alert headline
 * @param {string} alert.plate - Vehicle registration
 * @param {string} alert.camera - Camera node ID
 * @param {string} alert.message - Description
 * @param {'critical'|'warning'|'info'} [alert.severity='critical']
 */
export function showAlertToast({ title, plate, camera, message, severity = 'critical' }) {
  const container = ensureToastContainer();
  playAlertBeep(severity === 'critical' ? 880 : 550, 'triangle', 0.2);

  const colors = {
    critical: { border: '#EF4444', badge: '#EF4444', icon: 'shield-alert' },
    warning: { border: '#F59E0B', badge: '#F59E0B', icon: 'alert-triangle' },
    info: { border: '#3B82F6', badge: '#3B82F6', icon: 'info' },
  };

  const c = colors[severity] || colors.critical;

  const toast = document.createElement('div');
  toast.className = 'cityai-alert-toast animate-in';
  toast.style.cssText = `
    pointer-events: auto;
    background: rgba(17, 24, 32, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid ${c.border}60;
    border-left: 5px solid ${c.border};
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${c.border}30;
    color: #F1F5F9;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    transition: all 0.3s ease;
  `;

  toast.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:10px;font-weight:700;letter-spacing:0.08em;background:${c.border}25;color:${c.border};padding:2px 8px;border-radius:4px;border:1px solid ${c.border}40;">
          🚨 ${severity.toUpperCase()} ALERT
        </span>
        <span style="font-size:11px;color:#94A3B8;font-family:var(--font-mono);">${new Date().toLocaleTimeString()} IST</span>
      </div>
      <button class="toast-close-btn" style="background:transparent;border:none;color:#94A3B8;cursor:pointer;padding:2px 6px;border-radius:4px;">✕</button>
    </div>

    <div style="font-size:14px;font-weight:700;color:#F8FAFC;">${title}</div>

    ${plate ? `
      <div style="font-family:var(--font-mono);font-size:13px;color:#3B82F6;display:flex;align-items:center;gap:6px;">
        <strong>Registration:</strong> <span style="background:#3B82F620;padding:1px 6px;border-radius:3px;">${plate}</span>
        ${camera ? `<span style="color:#94A3B8;">• Node: ${camera}</span>` : ''}
      </div>
    ` : ''}

    <div style="font-size:12px;color:#94A3B8;line-height:1.4;">${message}</div>

    <div style="display:flex;gap:8px;margin-top:6px;padding-top:8px;border-top:1px solid #25303A;">
      ${plate ? `<button class="btn btn--primary btn--sm toast-track-btn" style="font-size:11px;padding:4px 10px;">Track Route</button>` : ''}
      <button class="btn btn--secondary btn--sm toast-ack-btn" style="font-size:11px;padding:4px 10px;">Acknowledge</button>
    </div>
  `;

  // Bind Actions
  const closeBtn = toast.querySelector('.toast-close-btn');
  const ackBtn = toast.querySelector('.toast-ack-btn');
  const trackBtn = toast.querySelector('.toast-track-btn');

  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  };

  closeBtn.addEventListener('click', removeToast);
  ackBtn.addEventListener('click', removeToast);

  if (trackBtn && plate) {
    trackBtn.addEventListener('click', () => {
      removeToast();
      navigate('trajectory', { plate });
    });
  }

  // Auto remove after 9 seconds
  setTimeout(removeToast, 9000);

  container.appendChild(toast);
}
