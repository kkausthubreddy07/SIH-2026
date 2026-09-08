/* ============================================
   CITY AI — Alert Card Component
   Reusable alert card with severity styling & E-Challan triggers
   ============================================ */

import { navigate } from '../router.js';
import { showEChallanModal } from './echallan-modal.js';

/**
 * Create an alert card HTML string
 * @param {Object} alert - Alert data object
 */
export function createAlertCard(alert) {
  const severityIcons = {
    critical: '🔴',
    warning: '🟠',
    info: '🔵',
  };

  return `
    <div class="alert-card alert-card--${alert.severity}" data-alert-id="${alert.id}" style="${alert.acknowledged ? 'opacity: 0.6;' : ''}">
      <div class="alert-card__header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="alert-card__severity text-${alert.severity === 'info' ? 'primary' : alert.severity}">
            ${severityIcons[alert.severity] || '🔵'} ${alert.severity.toUpperCase()}
          </span>
          ${alert.acknowledged ? '<span class="badge badge--success" style="font-size: 10px;">ACKNOWLEDGED</span>' : ''}
        </div>
        <span class="alert-card__time">${alert.time}</span>
      </div>

      <div class="alert-card__title">${alert.title}</div>
      <div class="alert-card__detail">${alert.description}</div>

      ${alert.plate ? `
        <div class="alert-card__detail">
          <strong>Registration:</strong> <span style="font-family: var(--font-mono); color: var(--primary); font-weight:700;">${alert.plate}</span>
          ${alert.camera ? ` • <strong>Node:</strong> ${alert.camera}` : ''}
          ${alert.confidence ? ` • <strong>OCR:</strong> ${Math.round(alert.confidence * 100)}%` : ''}
        </div>
      ` : ''}

      ${alert.expectedRoute ? `
        <div class="alert-card__detail" style="margin-top: 8px;">
          <div><strong>Expected Corridor:</strong> <span style="color: var(--success);">${alert.expectedRoute.join(' → ')}</span></div>
          <div><strong>Actual Transit:</strong> <span style="color: var(--critical);">${alert.actualRoute.join(' → ')}</span></div>
        </div>
      ` : ''}

      <div class="alert-card__actions">
        ${alert.plate ? `<button class="btn btn--primary btn--sm alert-track-btn" data-plate="${alert.plate}"><i data-lucide="search"></i> View Vehicle</button>` : ''}
        ${alert.plate ? `
          <button class="btn btn--secondary btn--sm alert-challan-btn" 
            data-plate="${alert.plate}" 
            data-violation="${alert.title}" 
            data-camera="${alert.camera || 'VSKP-C07'}"
            data-time="${alert.time}">
            <i data-lucide="file-text"></i> Generate E-Challan
          </button>
        ` : ''}
        ${!alert.acknowledged ? `<button class="btn btn--secondary btn--sm alert-ack-btn" data-id="${alert.id}"><i data-lucide="check"></i> Acknowledge</button>` : ''}
        <button class="btn btn--ghost btn--sm alert-dismiss-btn"><i data-lucide="x"></i> Dismiss</button>
      </div>
    </div>
  `;
}

/**
 * Create a compact alert card (for dashboard)
 */
export function createCompactAlertCard(alert) {
  return `
    <div class="alert-card alert-card--${alert.severity}" style="margin-bottom: 0;">
      <div class="alert-card__header">
        <span class="alert-card__severity text-${alert.severity === 'info' ? 'primary' : alert.severity}">● ${alert.severity.toUpperCase()}</span>
        <span class="alert-card__time">${alert.time}</span>
      </div>
      <div class="alert-card__title">${alert.title}</div>
      <div class="alert-card__detail">
        ${alert.plate ? `<strong>Registration:</strong> ${alert.plate} • ` : ''}
        ${alert.camera ? `<strong>Node:</strong> ${alert.camera}` : ''}
      </div>
    </div>
  `;
}

/**
 * Bind click handlers to alert action buttons
 */
export function bindAlertActions(container) {
  container.querySelectorAll('.alert-track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('vehicles', { plate: btn.dataset.plate });
    });
  });

  container.querySelectorAll('.alert-challan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showEChallanModal({
        plate: btn.dataset.plate,
        violation: btn.dataset.violation,
        camera: btn.dataset.camera,
        time: btn.dataset.time,
        fine: btn.dataset.violation.includes('SPEED') ? 1500 : 2500,
        speed: btn.dataset.violation.includes('SPEED') ? '52 km/h' : '38 km/h',
        limit: '40 km/h',
      });
    });
  });

  container.querySelectorAll('.alert-ack-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.alert-card');
      if (card) {
        card.style.opacity = '0.6';
      }
      btn.innerHTML = '<i data-lucide="check-check"></i> Done';
      btn.disabled = true;
      if (window.lucide) window.lucide.createIcons();
    });
  });

  container.querySelectorAll('.alert-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.alert-card');
      if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.remove(), 300);
      }
    });
  });
}
