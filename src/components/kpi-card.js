/* ============================================
   CITY AI — KPI Card Component
   Reusable animated KPI metric card
   ============================================ */

import { animateCounter } from '../utils/animations.js';

/**
 * Create a KPI card HTML string
 * @param {Object} options
 * @param {string} options.id - Unique ID for counter animation
 * @param {string} options.label - Card label text
 * @param {number} options.value - Numeric value to display
 * @param {string} options.suffix - Suffix after value (e.g. '%', ' km/h')
 * @param {string} options.change - Change text (e.g. '+12.4% vs yesterday')
 * @param {'up'|'down'|'neutral'} options.changeDir - Change direction
 * @param {string} options.icon - Lucide icon name
 * @param {'blue'|'green'|'yellow'|'red'|'cyan'} options.color - Accent color
 */
export function createKpiCard({ id, label, value, suffix = '', change, changeDir = 'neutral', icon, color = 'blue' }) {
  const iconColorMap = {
    blue: 'kpi-card__icon--blue',
    green: 'kpi-card__icon--green',
    yellow: 'kpi-card__icon--yellow',
    red: 'kpi-card__icon--red',
    cyan: 'kpi-card__icon--cyan',
  };

  const changeIcon = changeDir === 'up' ? 'trending-up' : changeDir === 'down' ? 'trending-down' : '';

  return `
    <div class="kpi-card kpi-card--${color}">
      <div class="kpi-card__icon ${iconColorMap[color] || ''}">
        <i data-lucide="${icon}"></i>
      </div>
      <div class="kpi-card__label">${label}</div>
      <div class="kpi-card__value" id="${id}">0${suffix}</div>
      <div class="kpi-card__change kpi-card__change--${changeDir}">
        ${changeIcon ? `<i data-lucide="${changeIcon}" style="width:14px;height:14px;"></i>` : ''}
        ${change}
      </div>
    </div>
  `;
}

/**
 * Animate KPI counter after rendering
 */
export function animateKpi(id, target, options = {}) {
  const el = document.getElementById(id);
  if (el) {
    animateCounter(el, target, options);
  }
}
