/* ============================================
   CITY AI — Vehicle Card Component
   Reusable vehicle result and detection items
   ============================================ */

import { formatConfidence, getConfidenceLevel } from '../utils/formatters.js';

/**
 * Create a vehicle result stats grid
 */
export function createVehicleStats(vehicle) {
  return `
    <div class="vehicle-result__stats">
      <div class="vehicle-result__stat">
        <div class="vehicle-result__stat-label">First Seen (IST)</div>
        <div class="vehicle-result__stat-value">${vehicle.firstDetected}</div>
      </div>
      <div class="vehicle-result__stat">
        <div class="vehicle-result__stat-label">Last Seen (IST)</div>
        <div class="vehicle-result__stat-value">${vehicle.lastDetected}</div>
      </div>
      <div class="vehicle-result__stat">
        <div class="vehicle-result__stat-label">Nodes Visited</div>
        <div class="vehicle-result__stat-value">${vehicle.camerasVisited} Checkpoints</div>
      </div>
      <div class="vehicle-result__stat">
        <div class="vehicle-result__stat-label">City Distance</div>
        <div class="vehicle-result__stat-value">${vehicle.distance} km</div>
      </div>
    </div>
  `;
}

/**
 * Create a detection list item
 */
export function createDetectionItem(detection) {
  const confLevel = getConfidenceLevel(detection.confidence);
  const confBadge = confLevel === 'high' ? 'success' : confLevel === 'medium' ? 'warning' : 'critical';

  return `
    <div class="detection-list__item" data-plate="${detection.plate}">
      <div>
        <div class="detection-list__plate" style="color: var(--primary);">${detection.plate}</div>
        <div class="text-caption text-muted">${detection.type || ''} ${detection.speed ? '• ' + detection.speed + ' km/h' : ''}</div>
      </div>
      <div class="detection-list__meta">
        <span class="badge badge--${confBadge}">${formatConfidence(detection.confidence)}</span>
        <span style="font-family: var(--font-mono);">${detection.time}</span>
      </div>
    </div>
  `;
}

/**
 * Create a detection table row
 */
export function createDetectionRow(detection, cameraName = '') {
  const conf = detection.confidence <= 1 ? detection.confidence * 100 : detection.confidence;
  const confBadge = conf > 90 ? 'success' : 'warning';

  return `
    <tr style="transition:background 0.2s;" onmouseenter="this.style.background='var(--bg-elevated)'" onmouseleave="this.style.background='transparent'">
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);">
        <span style="font-family:var(--font-mono);font-weight:600;color:var(--primary);">${detection.plate}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);">${detection.camera}${cameraName ? ' — ' + cameraName : ''}</td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-family:var(--font-mono);color:var(--text-secondary);">${detection.time}</td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);">
        <span class="badge badge--${confBadge}">${Math.round(conf)}%</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-secondary);">${detection.type || ''}</td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--border);text-align:right;">
        <button class="btn btn--ghost btn--sm detection-search-btn" data-plate="${detection.plate}">Track Route</button>
      </td>
    </tr>
  `;
}

/**
 * Create a confidence bar
 */
export function createConfidenceBar(value, label = '') {
  const pct = value <= 1 ? value * 100 : value;
  const level = pct >= 90 ? 'high' : pct >= 70 ? 'medium' : 'low';

  return `
    <div${label ? ' style="margin-bottom: 12px;"' : ''}>
      ${label ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span class="text-caption text-secondary">${label}</span>
          <span class="text-caption text-${level === 'high' ? 'success' : level === 'medium' ? 'warning' : 'critical'}">${Math.round(pct)}%</span>
        </div>
      ` : ''}
      <div class="confidence-bar">
        <div class="confidence-bar__fill confidence-bar__fill--${level}" data-width="${pct}" style="width: 0%;"></div>
      </div>
    </div>
  `;
}
