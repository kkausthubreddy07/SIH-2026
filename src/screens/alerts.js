/* ============================================
   CITY AI — Alerts Screen
   Alert center with severity filtering
   ============================================ */

import { alerts } from '../data/mock-data.js';
import { createAlertCard, bindAlertActions } from '../components/alert-card.js';

export function renderAlerts(container) {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Visakhapatnam Alert Center</h1>
        <div class="screen-header__subtitle">
          ${alerts.length} active notifications
          <span style="margin: 0 8px;">•</span>
          <span class="text-critical">${criticalCount} critical incidents</span>
          <span style="margin: 0 8px;">•</span>
          <span>IST Timeline</span>
        </div>
      </div>
      <div class="screen-header__actions">
        <button class="btn btn--secondary btn--sm" id="btn-ack-all-alerts">
          <i data-lucide="check-check"></i> Acknowledge All
        </button>
        <button class="btn btn--secondary btn--sm" id="btn-export-alerts">
          <i data-lucide="download"></i> Export Report
        </button>
      </div>
    </div>

    <!-- Summary -->
    <div class="alert-summary stagger-children">
      <div class="alert-summary__item">
        <div class="alert-summary__count" style="color: var(--text);">${alerts.length}</div>
        <div class="alert-summary__label">Total Alerts</div>
      </div>
      <div class="alert-summary__item" style="border-left: 3px solid var(--critical);">
        <div class="alert-summary__count" style="color: var(--critical);">${criticalCount}</div>
        <div class="alert-summary__label">Critical</div>
      </div>
      <div class="alert-summary__item" style="border-left: 3px solid var(--warning);">
        <div class="alert-summary__count" style="color: var(--warning);">${warningCount}</div>
        <div class="alert-summary__label">Warning</div>
      </div>
      <div class="alert-summary__item" style="border-left: 3px solid var(--info);">
        <div class="alert-summary__count" style="color: var(--info);">${infoCount}</div>
        <div class="alert-summary__label">Informational</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="alert-tabs">
      <button class="alert-tabs__tab active" data-filter="all">All (${alerts.length})</button>
      <button class="alert-tabs__tab" data-filter="critical">Critical (${criticalCount})</button>
      <button class="alert-tabs__tab" data-filter="warning">Warning (${warningCount})</button>
      <button class="alert-tabs__tab" data-filter="info">Info (${infoCount})</button>
    </div>

    <!-- Alert Cards -->
    <div id="alert-list">
      ${alerts.map(a => createAlertCard(a)).join('')}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Tab filtering
  container.querySelectorAll('.alert-tabs__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.alert-tabs__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
      document.getElementById('alert-list').innerHTML = filtered.map(a => createAlertCard(a)).join('');

      if (window.lucide) window.lucide.createIcons();
      bindAlertActions(container);
    });
  });

  // Acknowledge all handler
  const ackAllBtn = container.querySelector('#btn-ack-all-alerts');
  if (ackAllBtn) {
    ackAllBtn.addEventListener('click', () => {
      alerts.forEach(a => { a.acknowledged = true; });
      container.querySelectorAll('.alert-card').forEach(card => {
        card.style.opacity = '0.6';
      });
      container.querySelectorAll('.alert-ack-btn').forEach(btn => {
        btn.innerHTML = '<i data-lucide="check-check"></i> Done';
        btn.disabled = true;
      });
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Export report handler
  const exportBtn = container.querySelector('#btn-export-alerts');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `visakhapatnam_alerts_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  bindAlertActions(container);
}
